
/**
 * This is the main entry point for your Firebase Functions.
 * All Genkit flows and backend functions are defined and exported from this file.
 */
import * as admin from 'firebase-admin';
import {getAuth} from "firebase-admin/auth";
import {getFirestore, serverTimestamp} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {logger} from "firebase-functions/v2";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  initializeApp();
}

/**
 * Creates a verification document with a code and sends it to the user.
 * This is the first step of the sign-up process.
 */
export const sendVerificationCode = functions.https.onCall(async (data, context) => {
    const db = getFirestore();
    const auth = getAuth();
    const { userId, email, password, fullName } = data;

    if (!userId || !email || !password || !fullName) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing userId, email, password, or fullName.');
    }
    
    try {
        // Check if a user with this email already exists in Firebase Auth
        const userExists = await auth.getUserByEmail(email).then(() => true).catch(() => false);
        if (userExists) {
            throw new functions.https.HttpsError('already-exists', 'A user with this email address already exists.');
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiry

        // Use the client-generated temporary UID as the document ID
        const verificationRef = db.collection('emailVerifications').doc(userId);
        
        const verificationData = {
            code,
            email,
            expires,
            fullName,
            password: password,
        };

        // 1. Store verification code in Firestore
        await verificationRef.set(verificationData);

        // 2. Create a document in the `mail` collection to trigger the "Trigger Email" extension.
        await db.collection('mail').add({
            to: email,
            message: {
                subject: 'Your Shopiggo Verification Code',
                html: `Hi ${fullName},<br><br>Your verification code is: <strong>${code}</strong><br><br>This code will expire in 15 minutes.`,
            },
        });
        
        logger.log(`Successfully created verification code and email document for user ID: ${userId}.`);
        return { success: true, message: 'Verification email has been queued.' };

    } catch (error: any) {
        logger.error("Error in sendVerificationCode:", error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'An error occurred while processing the verification code.');
    }
});


/**
 * Verifies the code, and if valid, creates the user in Auth and Firestore.
 */
export const verifyEmailCode = functions.https.onCall(async (data, context) => {
    const db = getFirestore();
    const auth = getAuth();
    const { userId, code } = data;

    if (!userId || !code) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing userId or verification code.');
    }

    const verificationRef = db.collection('emailVerifications').doc(userId);

    try {
        const docSnap = await verificationRef.get();

        if (!docSnap.exists) {
            throw new functions.https.HttpsError('not-found', 'No verification request found. Please sign up again.');
        }

        const { code: storedCode, expires, email, fullName, password: storedPassword } = docSnap.data()!;

        if (expires.toDate() < new Date()) {
            await verificationRef.delete();
            throw new functions.https.HttpsError('deadline-exceeded', 'The verification code has expired. Please sign up again.');
        }

        if (storedCode !== code) {
            throw new functions.https.HttpsError('invalid-argument', 'The verification code is incorrect.');
        }
        
        // --- SUCCESS! CODE IS VALID ---
        const userRecord = await auth.createUser({
            uid: userId, // Use the same UID from the temporary doc
            email: email,
            emailVerified: true,
            password: storedPassword,
            displayName: fullName,
        });

        // Create the user document in Firestore
        const userDocRef = db.collection('users').doc(userId);
        await userDocRef.set({
            fullName: fullName,
            email: email,
            createdAt: serverTimestamp(),
            tier: 'Free',
            goCoins: 0,
            mfaEnabled: false,
            hyperSearchCredits: 2,
        });
        
        // Delete the temporary verification document
        await verificationRef.delete();

        // Create a custom token to sign the user in on the client
        const customToken = await auth.createCustomToken(userId);
        
        logger.log(`Successfully verified email and created records for user: ${userId}`);
        return { success: true, token: customToken, isNewUser: true };

    } catch (error: any) {
        logger.error("Error verifying email code:", error);
         if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'An error occurred during verification.');
    }
});


/**
 * Searches the cleaned promotions collection in Firestore.
 */
export const searchDeals = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    
    const db = getFirestore();
    const { searchTerm, country } = data;
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
        return [];
    }

    const collectionRef = db.collection('promotions-cj-linksearch-clean');
    let query: admin.firestore.Query<admin.firestore.DocumentData> = collectionRef;

    if (country && typeof country === 'string' && country !== 'Global') {
        query = query.where('cleanTargetedCountries', 'array-contains', country);
    }
    
    query = query.orderBy('promotionStartDate', 'desc').limit(200);

    try {
        const snapshot = await query.get();
        if (snapshot.empty) {
            return [];
        }

        const allDeals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filteredDeals = allDeals.filter(deal => {
            const description = (deal.description || '').toLowerCase();
            const linkName = (deal.linkName || '').toLowerCase();
            const advertiserName = (deal.advertiserName || '').toLowerCase();
            
            return description.includes(lowercasedSearchTerm) ||
                   linkName.includes(lowercasedSearchTerm) ||
                   advertiserName.includes(lowercasedSearchTerm);
        });

        return filteredDeals.slice(0, 50); // Limit results sent to client
        
    } catch (error) {
        logger.error("Error searching deals in Firestore:", error);
        throw new functions.https.HttpsError('internal', "Failed to search for deals.");
    }
});


/**
 * Searches for products using the CJ GraphQL API.
 */
export const getCjProducts = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { query, advertiserId, linkId } = data;
     if (!query || !advertiserId || !linkId) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing query, advertiserId, or linkId.');
    }

    try {
        const products = await getProductsFromCJ(query, advertiserId, linkId);
        return products;
    } catch (error) {
        logger.error("Error fetching products from CJ:", error);
        throw new functions.https.HttpsError('internal', 'Failed to fetch products.');
    }
});

// Re-exporting getProductsFromCJ for internal use if needed, ensuring it's not a callable function itself.
export { getProductsFromCJ } from "./lib/cj";
