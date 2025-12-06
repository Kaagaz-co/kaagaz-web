# Brand Audit Form - Vercel Deployment Guide

## ✅ What's Been Configured for Vercel

### 1. Serverless Function
**Location:** `api/brand-audit-submission.js`
- Vercel automatically detects files in `/api` folder as serverless functions
- Endpoint: `/api/brand-audit-submission`
- Supports SendGrid, Resend, and Mailgun

### 2. Configuration Files
- `vercel.json` - Vercel project configuration
- Updated form to call `/api/brand-audit-submission`
- Removed Netlify-specific code

---

## 🚀 Vercel Deployment Steps

### Step 1: Connect to Vercel

**Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

---

### Step 2: Configure Environment Variables

1. **Go to Vercel Dashboard:**
   - Select your project
   - Click "Settings" tab
   - Click "Environment Variables" in sidebar

2. **Add Your Email Service Key:**

   **For Resend (Recommended):**
   ```
   Key: RESEND_API_KEY
   Value: re_your_actual_key_here
   Environment: Production, Preview, Development
   ```

   **For SendGrid:**
   ```
   Key: SENDGRID_API_KEY
   Value: SG.your_actual_key_here
   Environment: Production, Preview, Development
   ```

   **For Mailgun:**
   ```
   Key: MAILGUN_API_KEY
   Value: your_actual_key_here
   
   Key: MAILGUN_DOMAIN
   Value: mg.kaagaz.co
   
   Environment: Production, Preview, Development
   ```

3. **Redeploy:**
   - After adding variables, redeploy from "Deployments" tab
   - Or push a new commit to trigger auto-deploy

---

### Step 3: Set Up Email Service (Same as Before)

#### Recommended: Resend

**Why Resend:**
- Easiest setup
- 3,000 emails/month free
- Great for transactional emails

**Setup:**
1. Sign up at https://resend.com
2. Add domain `kaagaz.co` in Domains section
3. Add DNS records (provided by Resend)
4. Verify domain
5. Create API key
6. Add to Vercel environment variables

**DNS Records Example:**
```
Type: TXT
Name: @
Value: resend-verification=xxxxx

Type: TXT  
Name: _dmarc
Value: v=DMARC1; p=none;

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
```

---

## 🧪 Testing

### Local Development
```bash
# Install Vercel CLI
npm install -g vercel

# Run dev server with Vercel functions
vercel dev

# Access at http://localhost:3000
```

**Note:** `vercel dev` simulates the production environment locally.

### Production Testing
1. Deploy to Vercel
2. Visit your live URL (e.g., `kaagaz-web.vercel.app`)
3. Click "Book Your FREE Brand Audit"
4. Submit test form
5. Check email inbox

---

## 📁 Updated File Structure

```
kaagaz-web-1/
├── api/
│   └── brand-audit-submission.js    # Vercel serverless function
├── src/
│   └── components/
│       ├── BrandAuditForm.jsx        # Updated API endpoint
│       ├── layout/
│       │   └── Header.jsx
│       └── sections/
│           └── Contact.jsx
├── vercel.json                       # Vercel configuration
├── package.json                      # Updated build scripts
└── VERCEL_SETUP.md                  # This file
```

---

## 🔧 Vercel-Specific Features

### Automatic HTTPS
- Vercel provides free SSL certificates
- All deployments use HTTPS

### Preview Deployments
- Every Git push creates a preview deployment
- Test before merging to production

### Edge Functions (Optional)
- Ultra-fast serverless functions at the edge
- Can upgrade later if needed

### Analytics (Built-in)
- View real-time analytics in Vercel dashboard
- Monitor performance and errors

---

## 🔍 Troubleshooting

### Function Not Working
**Check:**
1. Function logs: Vercel Dashboard → Project → Functions → View Logs
2. Environment variables are set correctly
3. API endpoint is `/api/brand-audit-submission` (not `.netlify/functions/...`)

### Build Fails
**Solutions:**
```bash
# Clean install locally
rm -rf node_modules package-lock.json
npm install

# Test build
npm run build

# If successful, push to Git
git add .
git commit -m "Fix build"
git push
```

### Email Not Sending
**Check:**
1. Environment variables in Vercel dashboard
2. Email service API key is valid
3. Domain is verified in email service
4. Check function logs for errors

### CORS Issues
- Vercel functions automatically handle CORS
- Headers are set in the function code
- No additional configuration needed

---

## 📊 Monitoring

### View Function Logs
```bash
# Using Vercel CLI
vercel logs <deployment-url>

# Or in dashboard:
# Project → Deployments → Click deployment → View Function Logs
```

### Check Function Performance
- Vercel Dashboard → Analytics
- View execution time, error rate, invocation count

---

## 🎯 Quick Setup Checklist

- [ ] Create Vercel account
- [ ] Connect Git repository
- [ ] Deploy to Vercel
- [ ] Sign up for Resend (or other email service)
- [ ] Verify domain `kaagaz.co`
- [ ] Get API key from email service
- [ ] Add API key to Vercel environment variables
- [ ] Redeploy
- [ ] Test form submission
- [ ] Verify email delivery

---

## 🚀 Deployment Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Check environment variables
vercel env ls
```

---

## 💡 Pro Tips

### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. Wait for verification

### Automatic Deployments
- Push to `main` branch = Production deployment
- Push to other branches = Preview deployment
- Pull requests get automatic preview URLs

### Environment Variables per Branch
- Set different values for Production vs Preview
- Useful for testing with different API keys

---

## 📞 Support

**Vercel Issues:**
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

**Email Service Issues:**
- Check email service dashboard
- Review delivery logs
- Verify DNS records

**Form Issues:**
- Check browser console for errors
- Review Vercel function logs
- Test API endpoint directly

---

## ✨ Summary

**Migration Complete:**
- ✅ Moved from Netlify to Vercel
- ✅ Updated serverless function path
- ✅ Created Vercel configuration
- ✅ Updated build scripts

**Next Steps:**
1. Deploy to Vercel (5 minutes)
2. Add email service API key (5 minutes)
3. Verify domain for email sending (24-48 hours)
4. Test and launch! 🚀

**Estimated Total Setup Time:** 15-20 minutes (+ DNS propagation)

---

Good luck with your Vercel deployment! 🎉
