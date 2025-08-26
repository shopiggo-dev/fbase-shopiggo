/**
 * Cloud Run (Function) — User Account Deletion
 *
 * This function securely deletes a user's account data from Firestore
 * and their authentication record from Firebase Authentication.
 *
 * It is an HTTP-triggered function that expects a POST request with a
 * valid Firebase ID token in the Authorization header.
 */
const functions = require('@google-cloud/functions-framework');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp();
}

functions.http('deleteUserAccount', async (req, res) => {
    // Set CORS headers for preflight requests and response
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        // Send response to preflight OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        return res.status(204).send('');
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.');
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;

    try {
        decodedToken = await getAuth().verifyIdToken(idToken);
    } catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        return res.status(403).json({ error: 'Unauthorized: Invalid token.' });
    }

    const uid = decodedToken.uid;
    const db = getFirestore();

    // 1. Delete Firestore document first.
    try {
        const userDocRef = db.collection('users').doc(uid);
        const doc = await userDocRef.get();
        if (doc.exists) {
            await userDocRef.delete();
            console.log(`Successfully deleted Firestore data for user: ${uid}`);
        } else {
            console.log(`No Firestore document to delete for user: ${uid}. Proceeding with auth deletion.`);
        }
    } catch (error) {
        // If deleting the Firestore doc fails, stop the process to avoid orphaned auth users.
        console.error(`CRITICAL: Could not delete Firestore data for user ${uid}. Aborting deletion.`, error);
        return res.status(500).json({ error: 'Failed to delete user data. Please try again.' });
    }

    // 2. Delete the user from Firebase Authentication.
    try {
        await getAuth().deleteUser(uid);
        console.log(`Successfully deleted user: ${uid} from Firebase Authentication.`);
        return res.status(200).json({ success: true, message: 'Account successfully deleted.' });
    } catch (authError) {
        console.error(`CRITICAL: Failed to delete auth user ${uid}. The Firestore document may have been deleted. Manual cleanup required.`, authError);
        return res.status(500).json({ error: 'An error occurred while deleting the account.' });
    }
});