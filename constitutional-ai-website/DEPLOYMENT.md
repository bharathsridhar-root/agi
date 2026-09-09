# Deployment Guide: GitHub to AWS Amplify

## Quick Start (5 minutes)

### Step 1: Push to GitHub

```bash
cd constitutional-ai-website
git add .
git commit -m "Initial commit: Constitutional AI Platform website"
git push origin main
```

### Step 2: Connect to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click **"New app"** → **"Host web app"**
3. Select **GitHub** as deployment source
4. Click **"Authorize"** and sign in with your GitHub account
5. Select your repository (`agi`)
6. Select branch: `main`
7. Accept default build settings (they work perfectly for Next.js)
8. Click **"Save and deploy"**

### Step 3: Wait for Deployment

- Amplify will automatically build and deploy your site
- Watch the deployment progress in the console
- Once complete, you'll get a live URL (e.g., `https://main.xxx.amplifyapp.com`)

## What Happens Next

1. **Every push to `main` branch** automatically triggers a new deployment
2. **Build takes ~3-5 minutes**
3. **Your site is live** at the Amplify URL
4. **Custom domain** can be added in Amplify console settings

## Deployment Status

### Live URL
Once deployed, your site will be accessible at:
```
https://main.[random-id].amplifyapp.com
```

### Environment Variables (if needed)
In Amplify Console:
1. Go to "Environment variables"
2. Add any `.env` variables
3. Redeploy

## Troubleshooting

### Build Fails?
1. Check build logs in Amplify console
2. Verify all dependencies in `package.json`
3. Run `npm install` locally to test
4. Check Node.js version compatibility

### Site Looks Broken?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check for console errors (F12 → Console)

### Performance Issues?
1. Amplify automatically optimizes images
2. Check network tab in DevTools
3. Consider AWS CloudFront CDN for even faster delivery

## Advanced Configuration

### Custom Domain
1. In Amplify Console → "Domain management"
2. Click "Add domain"
3. Connect your custom domain
4. Update DNS records

### Build Settings
The default `amplify.yml` is optimized for Next.js. Don't modify unless you know what you're doing.

### Preview Deployments
Enable PR previews in Amplify settings to test changes before merging:
1. Console → "Previews"
2. Enable "PR preview"
3. Now every PR gets auto-deployed

## Monitoring

### AWS CloudWatch
Amplify integrates with CloudWatch for:
- Build metrics
- Performance monitoring
- Error tracking

Access via AWS Console → CloudWatch

### Real-time Logs
In Amplify Console:
1. Select your app
2. "Deployments" tab
3. Click any deployment to see logs

## Cost

AWS Amplify free tier includes:
- 15 GB build time per month
- 5 deployments per hour
- Essential hosting
- Custom domains

Perfect for your needs! ✨

## Next Steps

1. ✅ Push to GitHub
2. ✅ Connect Amplify
3. ✅ Watch it deploy
4. 🎉 Share your live URL!

---

**Questions?** Check AWS Amplify docs: https://docs.amplify.aws/
