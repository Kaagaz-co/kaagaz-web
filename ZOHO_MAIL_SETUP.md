# Using Zoho Mail for Brand Audit Form

## ✅ Zoho Mail Integration Added

Perfect! You can now use your existing Zoho Mail account to send confirmation emails.

---

## 🔧 Setup Instructions

### Step 1: Enable IMAP/SMTP in Zoho Mail

1. **Log in to Zoho Mail:**
   - Go to https://mail.zoho.com
   - Sign in with your account

2. **Enable IMAP Access:**
   - Click Settings (gear icon) → Mail Accounts
   - Select your account (info@kaagaz.co)
   - Scroll to "IMAP Access"
   - Enable IMAP access if not already enabled

3. **Note Your Credentials:**
   - Email: `info@kaagaz.co`
   - You'll need your Zoho Mail password

---

### Step 2: Create App-Specific Password (Recommended)

For better security, create an app-specific password:

1. Go to Zoho Accounts: https://accounts.zoho.com
2. Click "Security" → "App Passwords"
3. Click "Generate New Password"
4. Name it: "Kaagaz Website Form"
5. Copy the generated password

**This is more secure than using your main password!**

---

### Step 3: Add to Vercel Environment Variables

1. **Go to Vercel Dashboard:**
   - Select your project
   - Click "Settings" → "Environment Variables"

2. **Add These Variables:**
   ```
   Key: ZOHO_MAIL_USER
   Value: info@kaagaz.co
   Environment: Production, Preview, Development

   Key: ZOHO_MAIL_PASSWORD
   Value: your_app_specific_password_here
   Environment: Production, Preview, Development
   ```

3. **Redeploy:**
   - Go to "Deployments" tab
   - Click "Redeploy" on latest deployment

---

## 📧 Zoho SMTP Settings (Already Configured)

The serverless function is already configured with these Zoho SMTP settings:

- **Host:** smtp.zoho.com
- **Port:** 465 (SSL)
- **Secure:** Yes
- **Authentication:** Username + Password

---

## 🧪 Testing

### Local Testing with Vercel Dev
```bash
# Create .env.local file
echo "ZOHO_MAIL_USER=info@kaagaz.co" > .env.local
echo "ZOHO_MAIL_PASSWORD=your_password_here" >> .env.local

# Run Vercel dev server
vercel dev

# Test the form at http://localhost:3000
```

### Production Testing
1. Deploy to Vercel with environment variables
2. Visit your live site
3. Submit test form
4. Check inbox at info@kaagaz.co

---

## 🔍 Troubleshooting

### Problem: "Authentication failed"
**Solutions:**
- Verify email is `info@kaagaz.co` (exact match)
- Use app-specific password, not main password
- Check if IMAP is enabled in Zoho settings
- Try generating a new app-specific password

### Problem: "Connection refused"
**Solutions:**
- Verify SMTP is enabled in your Zoho account
- Check firewall isn't blocking port 465
- Try alternative port 587 (TLS) - I can update if needed

### Problem: Email not sending
**Solutions:**
- Check Vercel function logs for errors
- Verify environment variables are set correctly
- Test SMTP credentials with an email client first
- Check Zoho Mail sent folder for sent emails

### Problem: "Daily limit exceeded"
**Solutions:**
- Zoho Mail free tier has sending limits
- Upgrade to Zoho Mail paid plan if needed
- Or use alternative service (Resend, SendGrid)

---

## 📊 Zoho Mail Limits

### Free Plan
- **Emails per day:** 500 emails
- **Recipients per email:** 50
- **Attachment size:** 25 MB
- **Storage:** 5 GB

### Paid Plans (if needed)
- **Mail Premium:** Unlimited emails
- **Better deliverability**
- **Priority support**

---

## 🔐 Security Best Practices

1. ✅ **Use App-Specific Password** (not main password)
2. ✅ **Store in environment variables** (never in code)
3. ✅ **Enable 2FA** on Zoho account
4. ✅ **Rotate passwords** regularly
5. ✅ **Monitor sent emails** for unusual activity

---

## 🎯 Quick Setup Checklist

- [ ] Log in to Zoho Mail
- [ ] Enable IMAP access
- [ ] Generate app-specific password
- [ ] Add `ZOHO_MAIL_USER` to Vercel
- [ ] Add `ZOHO_MAIL_PASSWORD` to Vercel
- [ ] Redeploy on Vercel
- [ ] Test form submission
- [ ] Verify email received

---

## 💡 Advantages of Using Zoho Mail

✅ **No additional cost** - You already have it  
✅ **Familiar interface** - Use your existing email  
✅ **Professional** - Emails come from your domain  
✅ **Reliable** - Zoho has good deliverability  
✅ **Integrated** - Same account for sending and receiving  

---

## 🔄 Alternative: Still Want to Use Other Services?

The function supports multiple email services. Priority order:

1. **Zoho Mail** (if `ZOHO_MAIL_USER` is set)
2. SendGrid (if `SENDGRID_API_KEY` is set)
3. Resend (if `RESEND_API_KEY` is set)
4. Mailgun (if `MAILGUN_API_KEY` is set)

Just set the environment variables for your preferred service!

---

## 📞 Support

**Zoho Mail Issues:**
- Support: https://help.zoho.com/portal/en/community/mail
- SMTP Guide: https://www.zoho.com/mail/help/zoho-smtp.html

**Vercel Issues:**
- Check function logs in Vercel dashboard
- Review environment variables

**Form Issues:**
- Test SMTP settings first
- Check browser console for errors

---

## ✨ You're All Set!

Your brand audit form will now send emails through your Zoho Mail account (info@kaagaz.co).

**Estimated Setup Time:** 5-10 minutes

Just add the environment variables to Vercel and redeploy! 🚀
