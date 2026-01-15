import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { to, body } = req.body;

    if (!to || !body) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, body',
      });
    }

    // Initialize Twilio client
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Format WhatsApp number (ensure it has + prefix)
    const phoneNumber = to.startsWith('+') ? to : `+${to}`;

    // Send WhatsApp message
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${phoneNumber}`,
      body,
    });

    console.log(`✅ WhatsApp sent to: ${phoneNumber}`);
    return res.status(200).json({
      success: true,
      message: `WhatsApp message sent successfully to ${phoneNumber}`,
    });
  } catch (error) {
    console.error('❌ WhatsApp sending error:', error);
    return res.status(500).json({
      success: false,
      message: `WhatsApp failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}
