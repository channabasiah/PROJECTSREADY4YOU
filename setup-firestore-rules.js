const admin = require('firebase-admin');
const serviceAccount = require('./projectsready4u-79323-firebase-adminsdk-fbsvc-a5aad4411e.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'projectsready4u-79323'
});

const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public projects: anyone can read
    // Private projects: only owner and those in accessList can read
    match /projects/{projectId} {
      allow read: if 
        resource.data.isPrivate == false ||
        request.auth != null && (
          resource.data.owner == request.auth.uid ||
          request.auth.token.email.matches('.*admin.*') ||
          request.auth.uid in resource.data.accessList
        );
      
      allow update: if request.resource.data.views != null && 
                      resource.data.views + 1 == request.resource.data.views ||
                      request.resource.data.requests != null && 
                      resource.data.requests + 1 == request.resource.data.requests ||
                      request.auth != null && (
                        resource.data.owner == request.auth.uid ||
                        request.auth.token.email.matches('.*admin.*')
                      );
      
      allow write: if request.auth != null && (
        request.auth.token.email.matches('.*admin.*') ||
        request.auth.uid == request.resource.data.owner
      );
    }

    // Project access list (who has permission to view private projects)
    match /projectAccess/{accessId} {
      allow read: if request.auth != null && (
        resource.data.grantedTo == request.auth.uid ||
        resource.data.projectOwner == request.auth.uid ||
        request.auth.token.email.matches('.*admin.*')
      );
      allow write: if request.auth != null && (
        request.auth.uid == request.resource.data.projectOwner ||
        request.auth.token.email.matches('.*admin.*')
      );
    }

    // Allow users to read/write their own user profiles
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow users to read/write their own requests
    match /requests/{document=**} {
      allow read: if request.auth != null && (
        resource.data.userEmail == request.auth.token.email ||
        request.auth.token.email.matches('.*admin.*')
      );
      allow create: if request.auth != null && request.resource.data.userEmail == request.auth.token.email;
      allow update, delete: if request.auth != null && (
        resource.data.userEmail == request.auth.token.email ||
        request.auth.token.email.matches('.*admin.*')
      );
    }

    // Allow admins to read/write analytics
    match /analytics/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.email.matches('.*admin.*');
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

console.log('Firestore Security Rules to apply:\n');
console.log(firestoreRules);
console.log('\n\n📋 TO APPLY THESE RULES:\n');
console.log('1. Go to https://console.firebase.google.com');
console.log('2. Select "projectsready4u-79323"');
console.log('3. Click "Firestore Database"');
console.log('4. Click "Rules" tab');
console.log('5. Replace ALL content with the rules above');
console.log('6. Click "Publish"');
console.log('\nThe rules will take effect immediately after publishing.');
