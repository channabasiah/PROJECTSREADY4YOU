import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';

// Project operations
export const addProject = async (projectData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      requests: 0,
      sales: 0,
      revenue: 0,
      rating: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const getProjects = async (filters?: { category?: string; techStack?: string[] }) => {
  try {
    let constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    const q = query(collection(db, 'projects'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const getProjectById = async (id: string) => {
  try {
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
};

export const updateProject = async (id: string, updates: any) => {
  try {
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const incrementProjectViews = async (projectId: string) => {
  try {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(docRef, {
        views: currentViews + 1,
      });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
};

// Request operations
export const addRequest = async (requestData: any) => {
  try {
    // Validate amount field
    if (requestData.amount === undefined || requestData.amount === null) {
      throw new Error('Amount is required to submit a request');
    }

    // Store the generated request ID before saving
    const generatedRequestId = requestData.requestId;

    const docRef = await addDoc(collection(db, 'requests'), {
      ...requestData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadEnabled: false,
    });
    
    // Use the generated request ID, not the Firestore document ID
    const requestId = generatedRequestId;

    // Debug: Log the request data
    console.log('Request Data:', {
      projectName: requestData.projectName,
      userName: requestData.userName,
      email: requestData.email,
      amount: requestData.amount,
    });

    // Fetch email template from Firestore
    let emailTemplate = await getEmailTemplate('request-received');
    if (!emailTemplate) {
      emailTemplate = getDefaultEmailTemplate();
    }

    // Ensure projectName has a fallback value
    const projectNameToUse = requestData.projectName || 'Your Project';

    // Replace template variables
    let emailHtml = emailTemplate.content
      .replace('{{userName}}', requestData.userName || 'User')
      .replace(/{{projectName}}/g, projectNameToUse)
      .replace('{{requestId}}', requestId)
      .replace('{{amount}}', requestData.amount)
      .replace('{{whatsappSupport}}', '+919986062337')
      .replace('{{emailSupport}}', 'support@projectsready4you.com');

    console.log('Email being sent with projectName:', projectNameToUse);

    // Send email notification to user
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: requestData.email,
          subject: emailTemplate.subject || 'Payment Request Received - Projects Ready 4 You',
          html: emailHtml,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    // Send WhatsApp notification to user
    try {
      await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: requestData.whatsapp,
          body: `Hi ${requestData.userName}! 👋\n\nWe received your payment request for ${projectNameToUse}.\n\nRequest ID: ${requestId}\n\nOur admin will send you payment details shortly. Check your email for more info!\n\nProjects Ready 4 You 🚀`,
        }),
      });
    } catch (whatsappError) {
      console.error('Failed to send WhatsApp:', whatsappError);
    }

    // Notify admin about new request
    console.log(`✅ New request created: ${requestId}`);

    return requestId;
  } catch (error) {
    console.error('Error adding request:', error);
    throw error;
  }
};

export const getRequests = async (filters?: { status?: string; userId?: string }) => {
  try {
    let constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.userId) {
      constraints.push(where('userId', '==', filters.userId));
    }

    const q = query(collection(db, 'requests'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting requests:', error);
    throw error;
  }
};

export const getRequestById = async (id: string) => {
  try {
    const docRef = doc(db, 'requests', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting request:', error);
    throw error;
  }
};

export const getRequestByRequestId = async (requestId: string) => {
  try {
    const q = query(collection(db, 'requests'), where('requestId', '==', requestId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting request by requestId:', error);
    throw error;
  }
};

export const getRequestsByUserEmail = async (userEmail: string) => {
  try {
    const q = query(
      collection(db, 'requests'),
      where('userEmail', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting requests by user email:', error);
    throw error;
  }
};

export const updateRequest = async (id: string, updates: any) => {
  try {
    const docRef = doc(db, 'requests', id);
    const docSnap = await getDoc(docRef);
    const requestData = docSnap.data();

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // If status changed to "verified", send notification to user
    if (updates.status === 'verified' && requestData?.status !== 'verified') {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: requestData?.email,
            subject: 'Payment Verified! Download Access Granted',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #667eea;">✅ Payment Verified!</h2>
                <p>Hi ${requestData?.name},</p>
                <p>Great news! Your payment has been verified successfully. Your download access is now active!</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Download Details:</h3>
                  <p><strong>Project:</strong> ${requestData?.projectName}</p>
                  <p><strong>Request ID:</strong> ${id}</p>
                  <p><strong>Access Level:</strong> Full Download</p>
                </div>

                <p style="color: #666;">You can now access and download all project files. Check your account dashboard for the download link.</p>

                <p style="color: #999; font-size: 12px; margin-top: 30px;">This is an automated email. Please don't reply to this email.</p>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
      }

      try {
        await fetch('/api/send-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: requestData?.whatsapp,
            body: `🎉 Great news ${requestData?.name}!\n\nYour payment has been verified successfully! ✅\n\nYou now have full access to download ${requestData?.projectName}.\n\nCheck your dashboard to download the files.\n\nProjects Ready 4 You 🚀`,
          }),
        });
      } catch (whatsappError) {
        console.error('Failed to send verification WhatsApp:', whatsappError);
      }
    }
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
};

export const updateProjectStats = async (projectId: string, field: string, increment: number) => {
  try {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentValue = docSnap.data()[field] || 0;
      await updateDoc(docRef, {
        [field]: currentValue + increment,
      });
    }
  } catch (error) {
    console.error('Error updating project stats:', error);
    throw error;
  }
};

// Settings operations
export const updateAdminSettings = async (settings: any) => {
  try {
    const docRef = doc(db, 'admin', 'settings');
    await updateDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export const getAdminSettings = async () => {
  try {
    const docRef = doc(db, 'admin', 'settings');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
};

// Analytics operations
export const getAnalytics = async () => {
  try {
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    const requestsSnapshot = await getDocs(collection(db, 'requests'));

    let totalRevenue = 0;
    let totalSales = 0;
    let totalRequests = 0;
    let totalDownloads = 0;

    requestsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.paymentStatus === 'verified') {
        totalRevenue += data.amount || 0;
        totalSales += 1;
      }
      totalRequests += 1;
      totalDownloads += data.downloadEnabled ? 1 : 0;
    });

    return {
      totalProjects: projectsSnapshot.size,
      totalRequests,
      totalSales,
      totalRevenue,
      totalDownloads,
      conversionRate: totalRequests > 0 ? ((totalSales / totalRequests) * 100).toFixed(2) : 0,
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

// User Profile operations
export const saveUserProfile = async (userId: string, profileData: any) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', userId);
    await setDoc(userProfileRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true, userId };
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const createUserProfile = async (userId: string, email: string) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', userId);
    await setDoc(userProfileRef, {
      userId,
      email,
      name: '',
      phone: '',
      collegeName: '',
      profileCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true, userId };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(userProfileRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const isProfileComplete = async (userId: string) => {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) return false;
    return profile.profileCompleted === true && profile.name && profile.phone && profile.collegeName;
  } catch (error) {
    console.error('Error checking profile completeness:', error);
    return false;
  }
};

// Email Template operations
export const getEmailTemplate = async (templateId: string) => {
  try {
    const templateRef = doc(db, 'emailTemplates', templateId);
    const docSnap = await getDoc(templateRef);
    if (docSnap.exists()) {
      const template = docSnap.data();
      // Validate that template has the required variables
      if (template.content && template.content.includes('{{projectName}}') && template.content.includes('{{userName}}')) {
        return template;
      }
      // If template is corrupted, return null to use default
      console.warn('Email template missing required variables, using default');
      return null;
    }
    return null;
  } catch (error) {
    console.error('Error getting email template:', error);
    return null;
  }
};

export const saveEmailTemplate = async (templateId: string, templateData: any) => {
  try {
    const templateRef = doc(db, 'emailTemplates', templateId);
    await setDoc(templateRef, {
      ...templateData,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true, templateId };
  } catch (error) {
    console.error('Error saving email template:', error);
    throw error;
  }
};

export const getDefaultEmailTemplate = () => {
  return {
    subject: 'Payment Request Received - Projects Ready 4 You',
    whatsappSupport: '+919986062337',
    emailSupport: 'support@projectsready4you.com',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Payment Request Received ✅</h2>
        <p>Hi {{userName}},</p>
        <p>Thank you for your interest! We received your payment request for <strong>{{projectName}}</strong>.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Request Details:</h3>
          <p><strong>Request ID:</strong> {{requestId}}</p>
          <p><strong>Project:</strong> {{projectName}}</p>
          <p><strong>Amount:</strong> ₹{{amount}}</p>
        </div>

        <h3>About Your Project:</h3>
        <p>You have requested access to <strong>{{projectName}}</strong>. This is a premium project that includes:</p>
        <ul style="color: #333;">
          <li>Complete source code with documentation</li>
          <li>Installation and setup guide</li>
          <li>Video tutorials and demos</li>
          <li>Technical support for integration</li>
          <li>Lifetime access and updates</li>
        </ul>

        <h3>How to Proceed:</h3>
        <p style="color: #333; line-height: 1.6;">
          Our admin team will contact you shortly via WhatsApp with payment details. You can make the payment using:<br>
          • UPI (Unified Payments Interface)<br>
          • Bank Transfer<br>
          • Credit/Debit Card
        </p>

        <h3>Next Steps:</h3>
        <ol style="color: #333;">
          <li><strong>Wait for WhatsApp Contact:</strong> Our admin will message you within 1 hour with payment options</li>
          <li><strong>Make the Payment:</strong> Use the provided UPI ID or bank details to complete payment</li>
          <li><strong>Send Confirmation:</strong> Screenshot the payment receipt and send it via WhatsApp</li>
          <li><strong>Get Access:</strong> We'll verify and grant you instant access within 24 hours</li>
        </ol>

        <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0;">
          <p style="margin: 0; color: #2e7d32;"><strong>💡 Tip:</strong> Keep your WhatsApp enabled for faster communication and quicker access to your project!</p>
        </div>

        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          <strong>WhatsApp Support:</strong> {{whatsappSupport}}<br>
          <strong>Email Support:</strong> {{emailSupport}}
        </p>

        <p style="color: #999; font-size: 12px;">This is an automated email. Please don't reply to this email. Contact us via WhatsApp or the email support link above.</p>
      </div>
    `,
  };
};

