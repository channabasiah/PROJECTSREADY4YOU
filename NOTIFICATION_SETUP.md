# 📧 Email & WhatsApp Notifications Setup Guide

## Step 1: Gmail Configuration (for Email Notifications)

### 1a. Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Scroll down to "2-Step Verification"
3. Click "Enable 2-Step Verification"
4. Follow Google's instructions

### 1b. Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select:
   - **App:** Mail
   - **Device:** Windows Computer (or your device)
3. Google will generate a 16-character password
4. **Copy this password** (you'll need it in Step 3)

### 1c. Get Your Gmail Address
- Your email: `your-email@gmail.com`

---

## Step 2: Twilio Configuration (for WhatsApp Notifications)

### 2a. Create Twilio Account
1. Go to https://www.twilio.com/console
2. Sign up and verify your account
3. Get your **Account SID** and **Auth Token** from dashboard

### 2b. Get WhatsApp-Enabled Number
1. In Twilio Console, go to **Phone Numbers** → **Manage Numbers**
2. Click **Get Started with WhatsApp** 
3. Request a number (or use sandbox for testing)
4. Your WhatsApp number will be: `+1234567890` (example)

### 2c. Add Admin WhatsApp Number
- Your admin WhatsApp: `+91-9876543210` (example)

---

## Step 3: Update Your `.env.local` File

Open `E:\PROJECTSREADY4YOU\.env.local` and fill in these values:

```env
# Gmail Configuration
EMAIL_FROM=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_WHATSAPP_FROM=whatsapp:+1234567890

# Admin Details
ADMIN_EMAIL=admin@projects4you.com
ADMIN_WHATSAPP=+91-9876543210
```

---

## Step 4: Test the System

### 4a. Start the Development Server
```bash
npm run dev
```

### 4b. Test Email
1. Go to http://localhost:3002
2. Submit a project request with your email
3. Check your inbox for notification email

### 4c. Test WhatsApp
1. Submit request with your WhatsApp number
2. Check WhatsApp for notification message

---

## Credentials Checklist

- [ ] Gmail address obtained
- [ ] App password generated (16 characters)
- [ ] Twilio Account SID copied
- [ ] Twilio Auth Token copied
- [ ] WhatsApp number obtained
- [ ] `.env.local` updated with all values
- [ ] Dev server running
- [ ] Test email sent
- [ ] Test WhatsApp sent

---

## Troubleshooting

### Email Not Sending?
- Check `.env.local` has correct `EMAIL_FROM` and `EMAIL_PASSWORD`
- Verify Gmail has 2FA enabled
- Try a different app password

### WhatsApp Not Sending?
- Verify Twilio Account SID and Auth Token
- Check WhatsApp number format (should start with +)
- Ensure Twilio WhatsApp is enabled on your account
- Check if recipient number is WhatsApp-enabled

### Still Getting "Shortly" Messages?
- Clear browser cache: `Ctrl + Shift + Delete`
- Restart dev server: Stop and `npm run dev`

---

## Live System Behavior

✅ **When user submits request:**
- Email sent immediately with instructions
- WhatsApp sent immediately with confirmation
- Request ID shown to user

✅ **When admin verifies payment:**
- Email sent: "Payment Verified!"
- WhatsApp sent: "Access Granted!"
- User can download files

---

## Support

For issues:
1. Check console logs: `npm run dev` output
2. Verify all `.env.local` values
3. Test with real credentials (not placeholders)
