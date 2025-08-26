
/**
 * Cloud Run (Function) — Verify Email Code
 *
 * This function validates the 6-digit code provided by the user. If the code
 * is correct and not expired, it creates the user in Firebase Authentication
 * with the temporarily stored details and marks their email as verified.
 */
const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

functions.http('verifyEmailCode', async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.set('Access-Control-Max-Age', '3600');
        return res.status(204).send('');
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    const { userId, code } = req.body;

    if (!userId || !code) {
        return res.status(400).json({ error: 'Missing userId or code in request body.' });
    }

    const db = admin.firestore();
    const auth = admin.auth();
    const verificationRef = db.collection('emailVerifications').doc(userId);

    try {
        const docSnap = await verificationRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ error: 'No verification request found or it has expired. Please sign up again.' });
        }

        const { code: storedCode, expires, fullName, password } = docSnap.data();

        if (expires.toDate() < new Date()) {
            await verificationRef.delete();
            return res.status(410).json({ error: 'The verification code has expired. Please sign up again.' });
        }

        if (storedCode !== code) {
            return res.status(400).json({ error: 'The verification code is incorrect.' });
        }

        // --- SUCCESS! CODE IS VALID ---
        const userRecord = await auth.createUser({
            uid: userId,
            email: docSnap.data().email,
            emailVerified: true,
            password: password,
            displayName: fullName,
        });

        // Create the permanent user document in Firestore using the same UID
        const userDocRef = db.collection('users').doc(userRecord.uid);
        await userDocRef.set({
            fullName: fullName,
            email: docSnap.data().email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            tier: 'Free',
            goCoins: 0,
            mfaEnabled: false,
        });

        // Delete the temporary verification document
        await verificationRef.delete();
        
        console.log(`Successfully verified email and created user: ${userRecord.uid}`);
        return res.status(200).json({ success: true, message: 'User created successfully.' });

    } catch (error) {
        console.error("Error verifying code and creating user:", error);
        if (error.code === 'auth/uid-already-exists' || error.code === 'auth/email-already-exists') {
             await verificationRef.delete();
             return res.status(409).json({ error: 'A user with this email or ID already exists.' });
        }
        return res.status(500).json({ error: 'An internal error occurred during verification.' });
    }
});
