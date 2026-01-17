import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { requestData } = req.body;

    if (!requestData) {
      return res.status(400).json({ error: 'Missing request data' });
    }

    // Create the request in Firestore
    const docRef = await addDoc(collection(db, 'requests'), {
      ...requestData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadEnabled: false,
    });

    // Update project stats
    try {
      const projectRef = doc(db, 'projects', requestData.projectId);
      const projectSnap = await getDoc(projectRef);
      
      if (projectSnap.exists()) {
        const currentRequests = projectSnap.data().requests || 0;
        await updateDoc(projectRef, {
          requests: currentRequests + 1,
        });
      }
    } catch (statsError) {
      console.error('Error updating project stats:', statsError);
      // Don't fail the request if stats update fails
    }

    return res.status(200).json({
      success: true,
      requestId: requestData.requestId,
      firestoreId: docRef.id,
    });
  } catch (error: any) {
    console.error('Error creating request:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create request',
    });
  }
}
