
"use server";

export async function sendVerificationCodeAction(email: string, fullName: string, password: string) {

  // This URL MUST be replaced with your actual Cloud Run URL for this function
  const functionUrl = 'https://send-verification-code-696459401226.us-central1.run.app';

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName, password, isSignUp: true }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send verification code.');
    }

    const result = await response.json();
    return { success: result.success };
    
  } catch (error: any) {
    console.error("sendVerificationCodeAction Error:", error);
    const message = error.message || 'An unknown error occurred while sending the verification code.';
    return { success: false, error: message };
  }
}

export async function verifyEmailCodeAction(email: string, code: string) {
    // This URL MUST be replaced with your actual Cloud Run URL for this function
    const functionUrl = 'https://verify-email-code-696459401226.us-central1.run.app';
    
    try {
       const response = await fetch(functionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Verification failed.');
        }

        const result = await response.json();
        // Return the entire result object, which includes the success status
        return result;

    } catch (error: any) {
        console.error("verifyEmailCodeAction Error:", error);
        const message = error.message || 'An unknown error occurred during verification.';
        return { success: false, error: message };
    }
}
