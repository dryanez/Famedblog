# FAMED Test Prep Blog

Modern, SEO-optimized blog website for FAMED exam preparation built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✅ Modern, responsive design
- ✅ Full SEO optimization (meta tags, Open Graph, Twitter Cards)
- ✅ Sitemap and robots.txt
- ✅ Lead magnet landing page with email capture
- ✅ Blog listing and individual blog posts
- ✅ Practice resource links
- ✅ Mobile-friendly navigation
- ✅ Fast loading with Next.js optimization

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push this code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - FAMED blog website"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure everything
6. Click "Deploy"

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

## Environment Variables

For email capture to work, add these to Vercel:

```
NEXT_PUBLIC_SITE_URL=https://famedtestprep.com
MAILCHIMP_API_KEY=your_key_here (optional)
```

## Project Structure

```
famedtestprep-blog/
├── app/
│   ├── layout.tsx          # Root layout with SEO
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── blog/
│   │   └── page.tsx        # Blog listing
│   ├── lead-magnet/
│   │   └── page.tsx        # Lead magnet landing page
│   ├── api/
│   │   └── subscribe/
│   │       └── route.ts    # Email capture API
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── robots.ts           # SEO robots file
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer with links
│   ├── BlogCard.tsx        # Blog post card
│   └── LeadMagnetCTA.tsx   # Lead magnet CTA component
├── public/
│   └── FAMED_8WEEK_CORRECTED_STUDY_PLAN.pdf
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## SEO Features

- Meta tags (title, description, keywords)
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Structured data (Schema.org)
- Sitemap.xml (auto-generated)
- Robots.txt
- Canonical URLs
- Mobile responsive
- Fast loading (< 2s)

## Lead Magnet

The lead magnet landing page (`/lead-magnet`) captures emails and provides the free 8-week study guide. The PDF should be placed in the `public` folder.

## Blog Posts

Blog posts are currently hardcoded in the pages. To add a new blog post:

1. Create a new folder in `app/blog/[slug]/`
2. Add a `page.tsx` file with the blog content
3. Add the post to the blog listing in `app/blog/page.tsx`

## Customization

### Colors

Edit `app/globals.css` to change the color scheme:

```css
:root {
  --primary: #0066CC;    /* Blue */
  --secondary: #10B981;  /* Green */
  --accent: #F59E0B;     /* Orange */
}
```

### Content

- Homepage: `app/page.tsx`
- Blog listing: `app/blog/page.tsx`
- Lead magnet: `app/lead-magnet/page.tsx`
- Header: `components/Header.tsx`
- Footer: `components/Footer.tsx`

## License

© 2025 FAMED Test Prep. All rights reserved.
