# Nitish's Travel Blog

A modern, fully responsive static travel blog frontend built with HTML5, CSS3, Bootstrap 5, and vanilla JavaScript.  
No backend, build tools, or Node.js required — works straight out of the box and is ready for **AWS S3 Static Website Hosting** and **CloudFront**.

---

## Project Structure

```
project/
├── index.html          # Main page (single-page layout)
├── css/
│   └── style.css       # Custom styles (Bootstrap 5 extended)
├── js/
│   └── script.js       # All interactivity (no dependencies)
├── images/             # Place your images here (see list below)
└── README.md           # This file
```

---

## Features

| Section | Description |
|---|---|
| **Navigation** | Fixed, transparent-to-white navbar with smooth scroll & active link highlighting |
| **Hero** | Full-viewport background image with parallax effect and CTA buttons |
| **About** | Profile image, bio, animated stat counters |
| **Destinations** | 6 cards with category filter (All / Asia / Europe / Americas) |
| **Travel Tips** | 6 tip cards with hover animations |
| **Gallery** | 8-photo grid with lightbox modal |
| **Contact** | Validated form with loading state (wire up to backend or AWS SES later) |
| **Footer** | Social links, quick nav, newsletter sign-up, auto year |

---

## Images Required

Place the following files in the `images/` folder.  
Recommended sizes are noted — use free stock photos from [Unsplash](https://unsplash.com) or [Pexels](https://www.pexels.com).

| File | Usage | Recommended Size |
|---|---|---|
| `hero-bg.jpg` | Hero background | 1920 × 1080 px |
| `about.jpg` | About section profile photo | 400 × 400 px |
| `dest-kyoto.jpg` | Kyoto destination card | 600 × 400 px |
| `dest-santorini.jpg` | Santorini destination card | 600 × 400 px |
| `dest-patagonia.jpg` | Patagonia destination card | 600 × 400 px |
| `dest-bali.jpg` | Bali destination card | 600 × 400 px |
| `dest-prague.jpg` | Prague destination card | 600 × 400 px |
| `dest-machu-picchu.jpg` | Machu Picchu destination card | 600 × 400 px |
| `gallery-1.jpg` … `gallery-8.jpg` | Gallery thumbnails | 400 × 300 px |

> **Note:** All image `onerror` fallbacks are set to `via.placeholder.com`, so the site looks reasonable even without local images.

---

## Running Locally

Just open `index.html` in a browser — no server needed.

```bash
# Or serve with Python (optional, for avoiding CORS quirks)
python -m http.server 8080
# Then visit http://localhost:8080
```

---

## AWS S3 Deployment

### 1. Create an S3 Bucket

```bash
aws s3 mb s3://nitish-travel-blog --region us-east-1
```

### 2. Enable Static Website Hosting

```bash
aws s3 website s3://nitish-travel-blog \
  --index-document index.html \
  --error-document index.html
```

### 3. Set Public Read Policy

Create `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::nitish-travel-blog/*"
  }]
}
```

Apply it:
```bash
aws s3api put-bucket-policy \
  --bucket nitish-travel-blog \
  --policy file://bucket-policy.json
```

### 4. Upload Files

```bash
aws s3 sync . s3://nitish-travel-blog \
  --exclude "*.md" \
  --exclude ".git/*" \
  --cache-control "max-age=86400"
```

### 5. (Optional) CloudFront Distribution

- Create a CloudFront distribution pointing at the S3 bucket origin.
- Set the default root object to `index.html`.
- For custom domain + HTTPS, attach an ACM certificate (us-east-1 region).

---

## Connecting a Real Contact Form Backend

The contact form currently simulates submission (`setTimeout`).  
To wire it to a real backend, replace the `setTimeout` block in `js/script.js` with a `fetch()` call:

```javascript
// Example: AWS API Gateway + Lambda
const response = await fetch('https://YOUR_API_GATEWAY_URL/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

---

## Tech Stack

- **HTML5** — Semantic markup, accessibility attributes
- **CSS3** — Custom properties, flexbox, grid, animations
- **Bootstrap 5.3** — Grid, components, utilities (CDN)
- **Bootstrap Icons 1.11** — Icon font (CDN)
- **Google Fonts** — Playfair Display + Inter (CDN)
- **Vanilla JavaScript** — No frameworks, no build step

---

## License

MIT — free to use and adapt for personal or commercial projects.
