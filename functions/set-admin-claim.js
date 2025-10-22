/*
 * This script sets a custom user claim to designate a user as an admin.
 * It requires a service account key file for authentication.
 * 
 * Instructions:
 * 1. Download your service account key from the Firebase Console:
 *    Project Settings > Service accounts > Generate new private key.
 * 2. Save the key as 'service-account-key.json' in this 'functions' directory.
 * 3. Ensure this file is listed in your .gitignore to keep it private.
 * 4. Run 'npm install' in the 'functions' directory.
 * 5. Run the script with 'npm run set-admin'.
 */

const admin = require('firebase-admin');

// The UID of the user to make an admin.
const uid = 'ugaYH4w5IBZtoohw8JlrebE0by73';

try {
  // Initialize the Admin SDK
  // The SDK automatically finds the service account key file.
  const serviceAccount = require('./service-account-key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  // Set the admin custom claim for the user
  admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
      console.log(`✅ Success! Custom claim set for user ${uid}.`);
      console.log('The user now has administrator privileges.');
      console.log("You can verify this in the Firebase Console (Authentication tab) by checking the user's token.");
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error setting custom claim:', error.message);
      process.exit(1);
    });

} catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
        console.error('\n❌ Critical Error: \'service-account-key.json\' not found.');
        console.error("Please download your service account key from the Firebase Console and place it in the 'functions' directory.");
    } else {
        console.error('\n❌ An unexpected error occurred:', error.message);
    }
    process.exit(1);
}
