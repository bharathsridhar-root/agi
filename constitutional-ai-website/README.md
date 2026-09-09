# Constitutional AI Governance Platform

A stunning, interactive website showcasing the Constitutional AI framework for safe, coordinated AI development.

## 🚀 Features

- **Interactive Scenarios** - Visualize how cascading failures occur and how Constitutional AI prevents them
- **Parallax Scrolling** - Smooth, engaging scroll effects throughout the site
- **Animated Transitions** - Smooth, hyper animations between sections
- **Byzantine Fault Tolerance Visualization** - Understand layered defenses
- **Five Core Principles** - Transparency, Containment, Human Authority, Coordination, Safe Failure
- **Defense Analysis** - Click to expand defense layers and understand costs/resilience
- **Responsive Design** - Works beautifully on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **Deployment**: AWS Amplify

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/bharathsridhar-root/agi.git
cd constitutional-ai-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 🚀 Deployment to AWS Amplify

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub** (if not already done)
```bash
git add .
git commit -m "Add Constitutional AI platform website"
git push origin main
```

2. **Connect to AWS Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Select "GitHub"
   - Authorize and select this repository
   - Select `main` branch
   - Click "Save and deploy"

3. **Amplify automatically deploys** on every push to main branch!

### Option 2: Manual Deployment

1. **Build for production**
```bash
npm run build
```

2. **Deploy to Amplify**
```bash
npm install -g @aws-amplify/cli
amplify init
amplify publish
```

## 📁 Project Structure

```
constitutional-ai-website/
├── pages/
│   ├── _app.tsx              # App wrapper
│   └── index.tsx             # Main landing page
├── components/
│   ├── Navigation.tsx         # Header navigation
│   ├── ParallaxScroll.tsx    # Parallax effect wrapper
│   ├── InteractiveScenario.tsx # Scenario comparison
│   └── sections/
│       ├── Hero.tsx          # Hero section
│       ├── Framework.tsx     # Governance framework
│       ├── Scenarios.tsx     # Interactive scenarios
│       ├── Principles.tsx    # Five core principles
│       ├── Defense.tsx       # Defense layers
│       └── CTA.tsx           # Call to action
├── styles/
│   └── globals.css           # Global styles & animations
├── package.json              # Dependencies
├── next.config.js            # Next.js config
├── tailwind.config.js        # Tailwind config
├── tsconfig.json             # TypeScript config
└── amplify.yml               # AWS Amplify config
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#0f172a',
  secondary: '#1e293b',
  accent: '#3b82f6',
  // ... more colors
}
```

### Content
- **Hero Section**: `components/sections/Hero.tsx`
- **Scenarios**: `components/sections/Scenarios.tsx` & `components/InteractiveScenario.tsx`
- **Principles**: `components/sections/Principles.tsx`
- **Defense**: `components/sections/Defense.tsx`

### Animations
Animations are configured in:
- `tailwind.config.js` - Tailwind animations
- `styles/globals.css` - Custom keyframes
- Component files - Framer Motion animations

## 🌐 Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://yoursite.amplify.app
```

## 📊 Performance

- Optimized animations using Framer Motion
- Lazy loading with React Intersection Observer
- CSS-in-JS for minimal bundle size
- Next.js automatic code splitting

## 🔒 Security

- No sensitive data stored client-side
- Content Security Policy ready
- HTTPS enforced on Amplify

## 📝 License

MIT License - Feel free to use and modify

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues or questions:
1. Check [GitHub Issues](https://github.com/bharathsridhar-root/agi/issues)
2. Create a new issue with detailed description
3. Include screenshots/videos if applicable

## 🚀 Next Steps

1. **Test locally**: `npm run dev`
2. **Push to GitHub**: `git push origin main`
3. **Deploy to Amplify**: Connect your GitHub repo to Amplify
4. **Share your deployment URL** - It's live!

---

**Made with ⚖️ for Constitutional AI Governance**

Build safe. Build coordinated. Build the future responsibly.
