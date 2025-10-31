import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "decentramind-af1c7",
      clientEmail: "firebase-adminsdk-fbsvc@decentramind-af1c7.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCdLzdCIM0B+QVY\nhXwqwqzsBoQ4zwdpWrA501xk6aKez/z6Vqbn18kouhGC8vcYVYcVAEdKMBb7E/Qq\nPT6oBJu/3RKn9bNw846wGHCyYo2r5mOKMcmKXRwBKsAO4RS7mVDbT/VwSZwe44/U\nApgNSgSlFvziepqCLkedA+bXpw9jN199ntP+lD/9JUsE995gosMJBCF4sJ51U0Yh\nr2FD6zPHH0ELICAEvPzYwT5GVhJ0VtmDoJ1mrF4cI1jHD2qs0U3OuQknCLLKtETe\nG9n2f60zS8+nT1rwN9Ysulbm5Fl7I4C3u17CEcpISq7aPg6PSfikJvLF7MIADq6P\nfI0oVlFhAgMBAAECggEAFXl7lDDvsUL4pFUVrLCMzXDqeZRspSEluGYUVm5xBZTR\nhtDLMXDoDloKxcLfWAIUrXLXSonIFKTE6UxqwKu4glL4FzMDQVLqffZ+LHDjKBwW\nzKzr+wJThCP3ZKZYSHUJeJ0I9ulSR19m/rEdXZts3QfcpC3Z6XUx2tV19qU1U07o\n3QyV6RTkL+Zw0uCTnkpsaD7xUIxqSRXR7VRXPM5+xu0MjES7amKAN65VfYOsyKEj\nV51vWC4ayPASKHDrOrgZCPSVaqg1gpVErVQ9Kn0sxa0cZX+IdJqZnj474NF0/Xqu\nRMqFq1cP3HI6pA6Y9AK/wzqrLxo/ZUYCbCgx90SfPQKBgQDP5xVTmZ1JJi3zLd3W\nyreSJlhgoHoV0ZdfKphvBB69DULTQH92+n2dNCe8zsEXM+D8NWA7Ch5Se8PrysNY\nVbvn2qGRirMDwZYDlMEw//orTn33od6cbtOBHw5LNstkJbq0Ifg6pXVzM4Ec89Ji\nrhcveU2ehTu5DCYDvWqYOf1JNwKBgQDBjF/OemeRyKSUBq0ek7wqle40C5mUdlPU\nCvQCmXNddUFwabGkq/Rofdx7RF6exxnFiLVuFelA9UtGgW/Kwc6LsWOFFuryRSD7\nnFbJNmxxsjNBnKAfMFyT2sruQY15iJ3ri7kaDStb/APRcQuLyFAn6UHFp1edW2iV\n3iCv/i4mJwKBgQDGWdPxBLgZGAHy5qmlyZZGK6tZ1QFlW6ettffkwuuItuQwpHJ3\n0xiRKTdYXXG/b1GRjmMXMNopG8eaaMLivjkeRWqsbsXIKaO0GvIOi8nkE2j/H0JB\nwUKtCDIc9FQsYgq03Uv0t/NMS7E9LCpm121rb7HsMXT/YWXLX6YZQgozFQKBgQCw\nb+XalS0a8ZxOMLPaXvS2oYzPNw/fDesnLoD4aaiINt7bug4tvm+EXdADMvVKqtes\ngg5ad3D2PWZMtKwTWo+OOrwtVBIDns8Nb5yRuqIrFzawhjZVmEGcq2Q4w9tTQh4r\n3mhz/jNbnCZi5DmRSJ8Bcxr5Mq6lDPIPRLnplb2+GwKBgQDPUIrPS4pCzTFhII7A\nsUGTUzAYiX9egg5SYPN42tjEThM1KbQyMc7wurGDcuTRuo5crQmNuHFkkWZceQfI\nZ32oYROsQw+mDCAzR61E6D8b1bAjOgjFWFesUUDbCqSLu9kXrMm+cuJi6cI66L9z\ni9avekEMsn7NIKCtwUonbfvaLQ==\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: "https://decentramind-af1c7-default-rtdb.firebaseio.com",
  });
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { publicKey, signature, message } = body;

    if (!publicKey || !signature) {
      return NextResponse.json(
        { error: 'Missing publicKey or signature' },
        { status: 400 }
      );
    }

    // In a real implementation, you would verify the Solana signature here
    // For development, we'll skip signature verification
    const isValidSignature = true; // Mock validation

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Create a custom token for Firebase authentication
    const customToken = await getAuth().createCustomToken(publicKey, {
      walletAddress: publicKey,
      provider: 'solana',
      verified: true,
      message: message || 'DecentraMind Authentication'
    });

    console.log('Created custom token for wallet:', publicKey);

    return NextResponse.json({ 
      token: customToken,
      success: true,
      walletAddress: publicKey
    });
  } catch (error) {
    console.error('Error creating custom token:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 