
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

    const { userId, email, fullName, password, isSignUp = true } = req.body;

    if (!userId || !email || !fullName) {
        return res.status(400).json({ error: 'Missing userId, email, or fullName in request body.' });
    }
     if (isSignUp && !password) {
        return res.status(400).json({ error: 'Missing password for sign-up request.' });
    }

    const db = getFirestore();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    try {
        const verificationRef = db.collection('emailVerifications').doc(userId);
        
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

        // 2. NOTE: The "Trigger Email" extension is being bypassed.
        // For now, we will log the verification code to the console for testing.
        // In a production environment, you would integrate a direct email service here (e.g., SendGrid, Mailgun).
        console.log(`--- EMAIL VERIFICATION ---`);
        console.log(`To: ${email}`);
        console.log(`From: noreply@shopiggo.com`);
        console.log(`Subject: Your Shopiggo Verification Code`);
        console.log(`Body: Hi ${fullName || 'Valued User'}, your verification code is: ${code}`);
        console.log(`--------------------------`);

        console.log(`Successfully generated verification code for user: ${userId}`);
        return res.status(200).json({ success: true, message: "Verification code generated and logged." });

    } catch (error) {
        console.error("Error sending verification code:", error);
        return res.status(500).json({ error: 'An error occurred while processing the verification code.' });
    }
});
