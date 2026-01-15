const admin = require('firebase-admin');
const serviceAccount = require('./projectsready4u-79323-firebase-adminsdk-fbsvc-a5aad4411e.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'projectsready4u-79323'
});

const auth = admin.auth();

// Test credentials
const testEmail = 'admin@123.com';
const testPassword = 'Admin@123456';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    const userRecord = await auth.createUser({
      email: testEmail,
      password: testPassword,
      emailVerified: true
    });

    console.log('\n✅ Admin Account Created Successfully!\n');
    console.log('================================');
    console.log('LOGIN CREDENTIALS:');
    console.log('================================');
    console.log(`Email:    ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log('================================\n');
    console.log(`User UID: ${userRecord.uid}`);
    console.log('\nYou can now login at: http://localhost:3000/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
}

createAdminUser();
