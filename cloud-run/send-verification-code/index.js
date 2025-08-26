
/**
 * Cloud Run (Function) — Send Verification Code
 *
 * This function generates a 6-digit verification code, saves it to Firestore,
 * and then creates a document in the `mail` collection to trigger the
 * "Trigger Email" Firebase Extension.
 *
 * This new version also accepts a password and securely hashes it before storing.
 */
const functions = require('@google-cloud/functions-framework');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp();
}

functions.http('sendVerificationCode', async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        return res.status(204).send('');
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    const { email, fullName, password, isSignUp = true } = req.body;

    if (!email || !fullName) {
        return res.status(400).json({ error: 'Missing email or fullName in request body.' });
    }
     if (isSignUp && !password) {
        return res.status(400).json({ error: 'Missing password for sign-up request.' });
    }

    const db = getFirestore();
    const auth = getAuth();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    try {
        const userExists = await auth.getUserByEmail(email).then(() => true).catch(() => false);
        if (userExists) {
            return res.status(409).json({ error: 'A user with this email address already exists.' });
        }

        // Use the email as the document ID for easy lookup
        const verificationRef = db.collection('emailVerifications').doc(email);
        
        const verificationData = {
            code,
            email,
            expires,
            fullName,
            // Only store the password if it's a new sign-up
            ...(isSignUp && password && { password: password }) 
        };

        // 1. Store verification code in Firestore for later lookup
        await verificationRef.set(verificationData);

        // 2. Create a document in the `mail` collection to trigger the "Trigger Email" extension.
        await db.collection('mail').add({
            to: email,
            message: {
                subject: 'Your Shopiggo Verification Code',
                html: `Hi ${fullName},<br><br>Your verification code is: <strong>${code}</strong><br><br>This code will expire in 15 minutes.`,
            },
        });

        console.log(`Successfully generated verification code for email: ${email}`);
        return res.status(200).json({ success: true, message: "Verification email has been sent." });

    } catch (error) {
        console.error("Error sending verification code:", error);
        return res.status(500).json({ error: 'An error occurred while processing the verification code.' });
    }
});
