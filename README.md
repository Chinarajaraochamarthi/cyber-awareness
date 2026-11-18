# 🔐 Cyber Awareness Module — Resilience Team

An interactive cybersecurity awareness web app built for the **Resilience Cybersecurity Team's** Cyber Wednesday program. It takes a user through a guided **tabletop exercise**, a **15-question scenario quiz** based on real-world incidents, **personalised improvement tips**, and a **printable certificate of completion**.

> Built with plain HTML, CSS and JavaScript — **no frameworks, no build step, no dependencies.**

---

## ✨ Features

- **Interactive tabletop exercise** — a 3-step vishing scenario (modelled on the Odido breach, Feb 2026) with discussion prompts and a guided debrief.
- **15-question scenario quiz** — each question is drawn from a real incident (MGM Resorts, Uber, Colonial Pipeline, deepfake CEO fraud, and more), with **instant per-answer feedback** explaining *why* an answer is right or wrong.
- **Personalised results** — the final screen shows improvement tips **only for the questions you got wrong**, so feedback is targeted, not generic.
- **Certificate of completion** — enter your name and download/print a formal certificate (score, rating and date) as a PDF.
- **Module progress tracker** — a step indicator across Tabletop → Quiz → Results.
- **Fully responsive** — mobile-first layout with a collapsible menu; works on phones, tablets and desktop.
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation, visible focus states and reduced-motion support.

---

## 🧱 Tech stack

| Layer | Choice |
|-------|--------|
| Markup | Semantic HTML5 |
| Styling | CSS custom properties, Flexbox & Grid, responsive media queries, print stylesheet |
| Logic | Vanilla JavaScript (ES6) — state object, DOM rendering, no libraries |
| Fonts | Playfair Display + DM Sans (Google Fonts) |
| Hosting | Static — deploys anywhere (GitHub Pages, Netlify, etc.) |

---

## 📁 Project structure

```
cyber-awareness/
├── index.html          # Page structure (all four screens)
├── css/
│   └── style.css        # All styling — responsive + print
├── js/
│   └── app.js           # Quiz logic, navigation, state, certificate
├── assets/
│   └── logo.png         # Resilience team logo
├── LICENSE              # MIT
└── README.md
```

---

## 🚀 Run it locally

No build tools required — just open the file:

```bash
# clone your repo, then:
open index.html        # macOS
# or simply double-click index.html
```

## 🌐 Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder, then **Save**.
5. Your site goes live at `https://<your-username>.github.io/<repo-name>/` (first deploy takes 1–2 minutes).

---

## 🎯 What this project demonstrates

*(Useful if you're showcasing it on a portfolio or resume.)*

- Building a multi-screen single-page app in **vanilla JavaScript** with clean state management — no framework.
- **Responsive, accessible UI** engineering (mobile-first, ARIA, keyboard support, print stylesheet).
- Translating **real security incidents** into effective, scenario-based training content.
- Thoughtful UX: progressive disclosure, targeted feedback, and a completion certificate.

---

## 🗂️ Incidents covered

| # | Scenario | Real incident |
|---|----------|---------------|
| 1 | Vishing / IT impersonation | Odido breach · Feb 2026 |
| 2 | Wire-transfer request | Business Email Compromise (BEC) |
| 3 | Helpdesk MFA reset | MGM Resorts · 2023 |
| 4 | Account-lock text | Smishing (SMS phishing) |
| 5 | MFA push spam | Uber MFA fatigue · 2022 |
| 6 | Badge sharing | Tailgating / physical access |
| 7 | Found USB drive | USB drop attack |
| 8 | Fake security email | Spear phishing / typosquatting |
| 9 | File encryption | Ransomware first response |
| 10 | Breached password | Credential stuffing / reuse |
| 11 | Café WiFi | Public WiFi / man-in-the-middle |
| 12 | Conference LinkedIn post | OSINT / oversharing |
| 13 | CFO voice call | Deepfake voice fraud |
| 14 | Colleague copying data | Insider threat awareness |
| 15 | Vendor remote access | Pretexting / vendor impersonation |

---

## 📜 License

Released under the [MIT License](LICENSE).

---

*Built by the Resilience Cybersecurity Team · #CyberWednesday — Know the Threat. Build the Habit.*
