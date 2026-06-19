# Amrender Singh — Security Architect & AI Security Engineer Portfolio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![hCaptcha](https://img.shields.io/badge/hCaptcha-009cde?style=flat&logo=hcaptcha&logoColor=white)](https://www.hcaptcha.com/)
[![Formspree](https://img.shields.io/badge/Formspree-E24A35?style=flat&logo=mailgun&logoColor=white)](https://formspree.io/)

A premium, secure, and fully responsive static portfolio website built using standard semantic HTML5, vanilla CSS3, and modern JavaScript. Designed with a sleek dark-mode glassmorphic Bento Grid interface and optimized for performance and strict security standards.

**Live Link:** [https://amrender644.github.io/](https://amrender644.github.io/)

---

## ⚡ Core Features

- **Premium Aurora Glassmorphism:** A state-of-the-art interactive dark UI design featuring smooth animated gradients, bento grid layout configurations, and 3D tilting project cards.
- **Hardware-Accelerated Custom Cursor:** A smooth micro-interactive cursor fallback system utilizing `translate3d` to prevent rendering lag. Fallbacks automatically to the system cursor on touch devices or if JavaScript is disabled.
- **Security Hardening (Strict CSP & Headers):** 
  - Zero inline JS execution (all scripts loaded externally/deferred).
  - Explicit Content Security Policy (CSP) headers protecting against XSS and clickjacking.
  - Setup for secure HTTP headers (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, and `Permissions-Policy`).
- **Secure Contact Form:** 
  - **Formspree Integration:** Secure form submission with honeypot validation (`_gotcha`).
  - **hCaptcha Anti-Spam:** Integrated hCaptcha widget with wildcard subdomain CSP rules allowing randomized captcha asset routes.
  - **Defense-In-Depth Validation:** Form rate-limiting (sessionStorage-backed) and time-gate checks prevent automated API submission.
  - **Client-side Verification:** Explicit checking of `h-captcha-response` token presence before network transfer.
- **WCAG AA Compliance:** Improved visual contrast metrics (contrast ratio `>= 4.9:1` for both light and dark theme text variables) to meet accessibility standards.
- **RFC-compliant security.txt:** Standardized vulnerability disclosure policy hosted under the canonical `/.well-known/security.txt` path.

---

## 🛠️ Local Development & Running

To run the portfolio locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amrender644/amrender644.github.io.git
   cd amrender644.github.io
   ```

2. **Serve the files:**
   Since the contact form and captcha rely on cross-origin requests (CORS) and site keys, serve the site using a local HTTP server instead of double-clicking the HTML file:
   - **Using Node (npx):**
     ```bash
     npx serve
     ```
   - **Using Python:**
     ```bash
     python -m http.server 3000
     ```

3. **Open the browser:**
   Navigate to `http://localhost:3000` (or the port specified by your runner).

---

## ⚙️ Configuration & Deployment

### 1. Formspree Setup
To route messages to your inbox:
1. Register/log in to [Formspree](https://formspree.io/).
2. Create a new form and copy your unique **Form ID**.
3. Open `index.html` and replace `xdapkjdl` in the form action with your ID:
   ```html
   <form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
   ```

### 2. hCaptcha Setup
To configure the anti-spam challenge:
1. Log in to [hCaptcha](https://www.hcaptcha.com/).
2. Create a new site key and copy the **Sitekey**.
3. In `index.html`, locate the hCaptcha container div and replace the `data-sitekey` value:
   ```html
   <div class="h-captcha" data-sitekey="YOUR_SITE_KEY"></div>
   ```

### 3. Deploying (Cloudflare Pages, GitHub Pages, Netlify)
- **Cloudflare Pages / Netlify:** The repository includes a `_headers` file. The platform will automatically parse this to serve the strict security headers (including CSP, HSTS, and Frame options) directly from the CDN edge.
- **GitHub Pages:** Serves the site directly as static pages. Ensure the repository name matches `username.github.io` for automatic apex-domain mapping.

---

## 🛡️ Security Policy & Vulnerability Disclosure

If you identify a security issue or vulnerability with this portfolio, please refer to the security policy guidelines in:
- [security.txt](file:///.well-known/security.txt)
- Or email directly: [amrenderpro3@gmail.com](mailto:amrenderpro3@gmail.com)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
