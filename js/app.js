/**
 * Cyber Awareness Module — Resilience Team
 * app.js — All quiz, tabletop, and navigation logic
 */

'use strict';

/* ════════════════════════
   STATE
════════════════════════ */
const state = {
  currentScreen: 'home',
  ttStep: 1,
  ttCompleted: false,
  qCurrent: 0,
  qScore: 0,
  wrongIds: [],
  quizStarted: false,
  userName: '',
};

/* ════════════════════════
   QUESTIONS
   15 real-incident scenarios
════════════════════════ */
const questions = [
  {
    id: 'vishing-odido',
    category: '📞 Phone call',
    incident: 'Odido breach · Feb 2026',
    text: 'You get a call from someone claiming to be IT. They say your account has been flagged and they need your login to push a reset before end of day.',
    scenario: '"Your account\'s been flagged. I need your login to push the reset — we have 10 minutes or the whole team gets locked out tonight."',
    options: [
      { text: 'Give the credentials — IT is allowed to have them and it sounds urgent.', correct: false },
      { text: 'Say you need to verify, hang up, and call IT back using a number you find yourself.', correct: true },
      { text: 'Ask them to send an email and ignore the call.', correct: false },
      { text: 'Give partial information while you buy time.', correct: false },
    ],
    feedbackRight: 'Exactly right. Verification through a number you find independently — not one the caller gave you — breaks the whole attack. Real IT never needs your password over the phone.',
    feedbackWrong: 'Real IT will never ask for your password over the phone. Hang up, find the official IT number independently, and call back. That 60-second step stopped attacks like the one that hit Odido in Feb 2026.',
    tip: { title: 'Vishing (Voice Phishing)', body: 'Attackers call pretending to be IT or authority figures. The Odido attack (Feb 2026) used exactly this — a phone call was enough to steal 6.39M records. Always verify by calling back on a number you found yourself, never one the caller gave you.' },
  },
  {
    id: 'bec',
    category: '📧 Email',
    incident: 'Business Email Compromise',
    text: 'An email from your CEO arrives asking you to wire £5,000 urgently for a confidential deal. Right name, right signature, completely legitimate-looking.',
    scenario: '"This is time-sensitive and confidential. Please process today and confirm once done. Do not discuss with others."',
    options: [
      { text: 'Process it — it\'s the CEO and they said it\'s urgent.', correct: false },
      { text: 'Reply to the email asking for more details.', correct: false },
      { text: 'Call the CEO directly on their known number before taking any action.', correct: true },
      { text: 'Forward to a colleague to get a second opinion.', correct: false },
    ],
    feedbackRight: 'Correct. BEC emails are designed to look exactly like executive requests. The only real verification is a direct phone call on a number you already have — not the email thread.',
    feedbackWrong: 'Business Email Compromise (BEC) emails are specifically crafted to look legitimate. Replying to the same thread gives the attacker more control. Only a direct phone call on a number you already know confirms real identity.',
    tip: { title: 'Business Email Compromise (BEC)', body: 'Attackers spoof or compromise executive email accounts to push through fraudulent payments. The "confidential" instruction is designed to prevent you from verifying. Any financial request by email requires a direct verbal confirmation using a number you already have.' },
  },
  {
    id: 'mgm-helpdesk',
    category: '📞 Helpdesk social engineering',
    incident: 'MGM Resorts breach · 2023',
    text: 'Someone calls your IT helpdesk saying they\'ve forgotten their MFA device. They give a full name, employee ID, and their manager\'s name — all correct.',
    scenario: '"I\'m travelling for a conference and left my phone at home. I just need my MFA reset quickly so I can access the portal."',
    options: [
      { text: 'Reset the MFA — they know all the right information.', correct: false },
      { text: 'Tell them to contact their manager to submit a formal request through the ticketing system.', correct: true },
      { text: 'Ask a few more security questions to verify further.', correct: false },
      { text: 'Ask them to email from their work account instead.', correct: false },
    ],
    feedbackRight: 'Right. All that information is findable on LinkedIn in under 10 minutes. The only safe path is a formal, verified request through established channels — no exceptions, even for urgency.',
    feedbackWrong: 'In the MGM Resorts 2023 breach, the attacker found employee details on LinkedIn and called the helpdesk. All the "correct" information was publicly available. The only safe response is to require a formal ticket — no over-the-phone exceptions.',
    tip: { title: 'Social Engineering via Helpdesk', body: 'MGM Resorts (2023) lost access to their entire IT infrastructure after an attacker researched an employee on LinkedIn and called IT claiming to be them. Never bypass MFA or account procedures based on a phone call, however convincing — always require a formal verified ticket.' },
  },
  {
    id: 'smishing',
    category: '📱 Text message',
    incident: 'Smishing attack',
    text: 'You get a text saying your company account will be locked in 2 hours unless you click a link and verify your password immediately.',
    options: [
      { text: 'Click the link — you don\'t want to lose access.', correct: false },
      { text: 'Ignore it and check if your account still works normally.', correct: false },
      { text: 'Report it to your security team right away and don\'t click the link.', correct: true },
      { text: 'Forward it to colleagues to warn them, then report it.', correct: false },
    ],
    feedbackRight: 'Correct. Reporting first (before forwarding) means your security team can warn everyone before colleagues click on it. Urgency + link in a text is always a red flag.',
    feedbackWrong: 'Forwarding before reporting risks colleagues clicking the link. Report to your security team immediately — they need to know so they can protect everyone on the list, not just you.',
    tip: { title: 'Smishing (SMS Phishing)', body: 'Legitimate systems don\'t lock your account via a text message link. Urgency + link in a text = classic smishing formula. Never click — report first, forward second (if at all).' },
  },
  {
    id: 'uber-mfa',
    category: '🔐 Multi-factor authentication',
    incident: 'Uber breach · 2022',
    text: 'You\'re working late and your phone suddenly starts getting repeated MFA push notifications you didn\'t request. It keeps coming every few minutes.',
    options: [
      { text: 'Approve one to make the notifications stop.', correct: false },
      { text: 'Ignore them — it\'s probably a system glitch.', correct: false },
      { text: 'Deny all requests, change your password immediately, and report to IT.', correct: true },
      { text: 'Wait until morning and report it to IT then.', correct: false },
    ],
    feedbackRight: 'Right. Repeated unsolicited MFA pushes is a known attack called MFA fatigue — the attacker hopes you\'ll approve just to make it stop. Deny everything, change your password, and report immediately.',
    feedbackWrong: 'In the Uber 2022 breach, the attacker kept sending MFA pushes until an employee approved one — just to stop the notifications. This is called MFA fatigue bombing. Never approve a request you didn\'t initiate. Deny, change password, report now.',
    tip: { title: 'MFA Fatigue Attack', body: 'Uber was breached in 2022 when an attacker sent repeated MFA push notifications until an employee approved one. If you receive unsolicited MFA requests, deny all of them, change your password immediately, and report to IT — do not wait until morning.' },
  },
  {
    id: 'tailgating',
    category: '🚪 Physical security',
    incident: 'Tailgating / physical access',
    text: 'A new colleague you recognise asks to borrow your access badge for a secure area. Their badge is still being processed by HR and they\'ve been waiting three days.',
    options: [
      { text: 'Lend them the badge — they\'re new and need help.', correct: false },
      { text: 'Use your badge to let both of you in together.', correct: false },
      { text: 'Decline politely and direct them to HR or security for proper access.', correct: true },
      { text: 'Get your manager to approve it, then lend the badge.', correct: false },
    ],
    feedbackRight: 'Correct. Badges are non-transferable for good reason. Even letting someone tailgate through behind you bypasses the access controls designed to protect everyone. The answer is always "go through the official process."',
    feedbackWrong: 'Sharing a badge or letting someone tailgate — even with someone you know — bypasses the physical security controls that protect everyone in that area. The right answer is always to send them through the official process, however inconvenient.',
    tip: { title: 'Physical Access & Tailgating', body: 'Physical security controls are only effective when everyone follows them, every time. Tailgating — even with friendly, familiar people — bypasses door access logs and creates untracked entry. Badges are personal and non-transferable without exception.' },
  },
  {
    id: 'usb-drop',
    category: '💾 Found device',
    incident: 'USB drop attack',
    text: 'You find a USB drive in the office car park labelled "Executive Salaries Q4 — Confidential." You want to find out who it belongs to.',
    options: [
      { text: 'Plug it into your computer to find out who the owner is.', correct: false },
      { text: 'Leave it where it is.', correct: false },
      { text: 'Pick it up without plugging it in and hand it to IT/security.', correct: true },
      { text: 'Check it on your personal computer rather than a work device.', correct: false },
    ],
    feedbackRight: 'Right. USB drop attacks deliberately use enticing labels to get people to plug them in. Malware can run automatically on connection — no click needed. Hand it to IT without connecting it anywhere.',
    feedbackWrong: 'USB drop attacks work because people are curious and want to help. Plugging it in — even on a personal device — can install malware automatically. The label is bait. Hand it to IT without connecting it.',
    tip: { title: 'USB Drop Attack', body: 'Attackers deliberately leave labelled USB drives in car parks and common areas. When a drive is plugged in, malware can run automatically with no user interaction required. Never plug in a found device — anywhere.' },
  },
  {
    id: 'phishing-email',
    category: '📧 Phishing email',
    incident: 'Spear phishing detection',
    text: 'You receive an email from "Microsoft Security" saying your account was accessed from an unusual location. The email looks official and has a "Secure your account" button.',
    scenario: 'From: security-noreply@micros0ft-alerts.com · Subject: Unusual sign-in activity detected on your account',
    options: [
      { text: 'Click "Secure your account" immediately — it could be a real breach.', correct: false },
      { text: 'Check the sender\'s full domain carefully before doing anything.', correct: true },
      { text: 'Forward it to IT and then click the link.', correct: false },
      { text: 'Reply to the email asking if it\'s legitimate.', correct: false },
    ],
    feedbackRight: 'Correct. The sender domain "micros0ft-alerts.com" uses a zero instead of an "o" — a classic typosquatting technique. Always check the full sender domain before clicking anything.',
    feedbackWrong: '"micros0ft-alerts.com" contains a zero instead of an "o" in Microsoft. Always check the full sender email address — not just the display name. Legitimate Microsoft security emails come from microsoft.com domains, never third-party alert domains.',
    tip: { title: 'Phishing Email Detection', body: 'Attackers use lookalike domains (micros0ft, paypa1, g00gle) that pass a quick glance. Always check the full sender email address — not just the display name. Hover over links before clicking to see the real destination URL.' },
  },
  {
    id: 'ransomware-response',
    category: '🔒 Ransomware',
    incident: 'Ransomware response',
    text: 'You notice your computer is running very slowly and files are appearing with strange extensions. A ransom message briefly appears on screen before disappearing.',
    options: [
      { text: 'Restart the computer — maybe it\'ll fix itself.', correct: false },
      { text: 'Immediately disconnect from the network, don\'t turn off the computer, and call IT security.', correct: true },
      { text: 'Try to delete the suspicious files yourself.', correct: false },
      { text: 'Back up your files to the company shared drive right away.', correct: false },
    ],
    feedbackRight: 'Right. Disconnecting from the network stops the ransomware from spreading to shared drives and other computers. Don\'t shut down — forensics often need the machine running. Backing up would spread the encrypted files.',
    feedbackWrong: 'The first priority is network isolation — not shutdown, not backup. Backing up would copy the corrupted files. Disconnect first, then call IT immediately.',
    tip: { title: 'Ransomware First Response', body: 'When you suspect ransomware: (1) Disconnect from the network — unplug ethernet, turn off WiFi. (2) Do NOT shut down or restart. (3) Do NOT back up files — you\'d back up the encrypted versions. (4) Call IT security right away. Speed of isolation determines how much damage is done.' },
  },
  {
    id: 'password-reuse',
    category: '🔑 Password security',
    incident: 'Credential stuffing attack',
    text: 'You use the same password for LinkedIn, your work email, and your personal email. You hear LinkedIn had a data breach. What do you do?',
    options: [
      { text: 'Wait to see if anything suspicious actually happens.', correct: false },
      { text: 'Change your LinkedIn password only.', correct: false },
      { text: 'Change your password on every account that shares that password, starting with work accounts.', correct: true },
      { text: 'Change your password on personal accounts but not work accounts — they\'re separate.', correct: false },
    ],
    feedbackRight: 'Correct. When a password is exposed in any breach, it\'s exposed everywhere you used it. Work accounts are higher priority because a compromised work account creates risks for your whole organisation.',
    feedbackWrong: 'When one account using a password is breached, all accounts sharing that password are at risk. Work accounts are the priority — a compromised work account creates risks for your entire organisation, not just you.',
    tip: { title: 'Password Reuse & Credential Stuffing', body: 'Attackers automatically try breached passwords across popular services (called "credential stuffing"). If one site is breached, every other site using that password is at risk. Use a unique password for every account. A password manager makes this practical.' },
  },
  {
    id: 'public-wifi',
    category: '📶 Network security',
    incident: 'Public WiFi / man-in-the-middle',
    text: 'You\'re in a coffee shop and need to review a client contract before a meeting. The café offers free WiFi called "CafeFreewifi." What\'s the safest approach?',
    options: [
      { text: 'Connect to the café WiFi — it\'s free and convenient.', correct: false },
      { text: 'Use your phone\'s mobile hotspot or company VPN instead of the café WiFi.', correct: true },
      { text: 'Connect to the café WiFi but only use HTTPS sites.', correct: false },
      { text: 'Ask the café staff for the official WiFi password to make sure it\'s the right one.', correct: false },
    ],
    feedbackRight: 'Right. Mobile hotspot or a corporate VPN creates an encrypted tunnel that protects your data regardless of the network you\'re on. Public WiFi — even with HTTPS — exposes your session to other risks.',
    feedbackWrong: 'Public WiFi networks can be monitored or spoofed (a fake hotspot with the same name as the real one). Even confirming the network name with staff doesn\'t guarantee safety. Use your phone\'s hotspot or a company VPN for anything sensitive.',
    tip: { title: 'Public WiFi Risks', body: 'Attackers set up rogue hotspots with names like "CafeFreeWiFi" that look identical to the real network. Even on a legitimate network, traffic can be intercepted. For sensitive work, always use a mobile hotspot or company VPN — not public WiFi.' },
  },
  {
    id: 'social-media-oversharing',
    category: '📱 Social media',
    incident: 'OSINT / open-source intelligence',
    text: 'Your colleague posts on LinkedIn: "Excited to be attending [Client Name] conference next week in Amsterdam! Great team effort from the whole [Company] security division."',
    options: [
      { text: 'No concern — it\'s great publicity for the company.', correct: false },
      { text: 'This is a minor issue but mostly harmless.', correct: false },
      { text: 'This is a risk — it reveals staff names, roles, travel plans, and client relationships.', correct: true },
      { text: 'Only a concern if it mentions internal systems or passwords.', correct: false },
    ],
    feedbackRight: 'Right. This post tells attackers: who works in your security team, what the client relationship is, that key staff will be away from the office, and when. That\'s everything needed to target the team with a timely vishing call.',
    feedbackWrong: 'The MGM Resorts attacker found all the information they needed on LinkedIn. Names, roles, teams, and travel plans are exactly what attackers use for pretexting — building a believable cover story before making contact.',
    tip: { title: 'Social Media & OSINT', body: 'Attackers use LinkedIn, Twitter and other platforms to research targets before an attack — called Open Source Intelligence (OSINT). "I\'m at a conference" tells attackers when you\'re away and distracted. "Working at [Company] in [role]" builds their cover story. Think before you post.' },
  },
  {
    id: 'deepfake-call',
    category: '🎙️ AI voice impersonation',
    incident: 'Deepfake audio fraud',
    text: 'You receive a voice call from your CFO asking you to approve an urgent overseas payment of £80,000. The voice sounds exactly like them. They ask you to process it before close of day.',
    options: [
      { text: 'Process it — it\'s their voice and it\'s urgent.', correct: false },
      { text: 'Tell them you\'ll call them back on their known number to confirm.', correct: true },
      { text: 'Ask them to verify by saying a code word.', correct: false },
      { text: 'Process half the amount now and confirm the rest later.', correct: false },
    ],
    feedbackRight: 'Right. Deepfake audio can replicate anyone\'s voice convincingly. The only protection is out-of-band verification — calling back on a number you already have, through a channel you already trust.',
    feedbackWrong: 'Deepfake voice technology can clone someone\'s voice from just a few minutes of audio. In 2020, a bank employee transferred £35M based on a deepfake call. The only protection is out-of-band verification — calling back on a number you already know.',
    tip: { title: 'Deepfake Voice Fraud', body: 'In 2020, a UAE bank employee transferred $35 million after receiving a deepfake voice call. AI voice cloning requires just minutes of audio — available from conference calls, public videos. Always verify large financial requests by calling back on a number you already have.' },
  },
  {
    id: 'insider-threat',
    category: '🏢 Insider behaviour',
    incident: 'Insider threat awareness',
    text: 'A colleague you trust well mentions they\'ve been copying client data to their personal USB drive "as a backup, just in case." They say IT doesn\'t need to know.',
    options: [
      { text: 'Mind your own business — it\'s probably fine.', correct: false },
      { text: 'Warn them informally but don\'t escalate.', correct: false },
      { text: 'Report it to your security team — this is a data policy violation regardless of their intent.', correct: true },
      { text: 'Only report it if you notice them doing it again.', correct: false },
    ],
    feedbackRight: 'Right. Data exfiltration to personal devices violates data protection policy regardless of the person\'s intentions. It also creates a risk you can\'t assess — you don\'t know what happens to that data once it\'s on their personal drive.',
    feedbackWrong: 'Even with good intentions, copying client data to personal devices creates risks you can\'t control — that device could be lost, stolen, or compromised. This is a security policy violation that must be reported regardless of the relationship.',
    tip: { title: 'Insider Threat Awareness', body: 'Insider threats include both malicious actions and well-intentioned but risky behaviour. Data copied to personal devices creates uncontrolled exposure. Report policy violations: you\'re protecting your colleague as much as the company.' },
  },
  {
    id: 'pretexting',
    category: '🎭 Pretexting',
    incident: 'Vendor impersonation',
    text: 'Someone calls claiming to be from your company\'s IT vendor. They say there\'s a critical security patch and ask you to allow them remote access to your computer to apply it right now.',
    options: [
      { text: 'Allow it — you recognise the company name and it sounds urgent.', correct: false },
      { text: 'Tell them you\'ll contact your IT team to verify and arrange access through the proper channel.', correct: true },
      { text: 'Ask them to email you first with the patch details.', correct: false },
      { text: 'Allow view-only access but not full control.', correct: false },
    ],
    feedbackRight: 'Exactly right. Legitimate vendors coordinate updates through your IT team — they don\'t call individual employees directly. All remote access must be verified and arranged through your IT department, not over the phone.',
    feedbackWrong: 'Legitimate IT vendors do not call individual employees to push urgent patches — they coordinate through the IT department. Granting remote access to an unverified caller gives them full control of your machine and everything on it.',
    tip: { title: 'Pretexting & Vendor Impersonation', body: 'Attackers research which vendors your company uses and impersonate them. Any request for remote access to your machine must go through your IT department — no exceptions. "It\'s urgent" and "your company will be at risk" are pressure tactics, not legitimate reasons to skip verification.' },
  },
];

/* ════════════════════════
   NAVIGATION
════════════════════════ */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');

  // Nav highlights
  document.querySelectorAll('.nav-step').forEach(s => s.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');

  // Module progress bar
  const progress = document.getElementById('module-progress');
  if (id === 'home') {
    progress.style.display = 'none';
  } else {
    progress.style.display = 'block';
    updateModuleProgress(id);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateModuleProgress(currentScreen) {
  const dot1 = document.getElementById('mp-dot-1');
  const dot2 = document.getElementById('mp-dot-2');
  const dot3 = document.getElementById('mp-dot-3');
  const line1 = document.getElementById('mp-line-1');
  const line2 = document.getElementById('mp-line-2');
  const step1 = document.getElementById('mp-step-1');
  const step2 = document.getElementById('mp-step-2');
  const step3 = document.getElementById('mp-step-3');

  // Reset
  [step1, step2, step3].forEach(s => s.classList.remove('active', 'done'));
  [line1, line2].forEach(l => l.classList.remove('done'));

  if (currentScreen === 'tabletop') {
    if (state.ttCompleted) { step1.classList.add('done'); } else { step1.classList.add('active'); }
    if (state.ttCompleted && state.quizStarted) { line1.classList.add('done'); }
  } else if (currentScreen === 'quiz') {
    step1.classList.add('done');
    step2.classList.add('active');
    line1.classList.add('done');
  } else if (currentScreen === 'results') {
    step1.classList.add('done');
    step2.classList.add('done');
    step3.classList.add('active');
    line1.classList.add('done');
    line2.classList.add('done');
  }
}

function goHome() {
  state.currentScreen = 'home';
  showScreen('home');
}

function toggleMobileMenu() {
  const mn = document.getElementById('mobile-nav');
  mn.classList.toggle('open');
}

/* ════════════════════════
   TABLETOP EXERCISE
════════════════════════ */

function startTabletop() {
  state.ttStep = 1;
  state.currentScreen = 'tabletop';
  showTTStep(1);
  showScreen('tabletop');
}

function showTTStep(step) {
  // Hide all panels
  ['1', '2', '3', 'debrief'].forEach(s => {
    const el = document.getElementById('tt-panel-' + s);
    if (el) el.style.display = 'none';
  });

  const target = document.getElementById('tt-panel-' + step);
  if (target) target.style.display = 'block';

  // Update dots
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById('tt-dot-' + i);
    dot.classList.remove('active', 'done');
    if (step === 'debrief' || (typeof step === 'number' && i < step)) {
      dot.classList.add('done');
    } else if (i === step) {
      dot.classList.add('active');
    }
  }

  const dbDot = document.getElementById('tt-dot-db');
  dbDot.classList.remove('active', 'done');
  if (step === 'debrief') dbDot.classList.add('active');

  // Update lines
  for (let i = 1; i <= 3; i++) {
    const line = document.getElementById('tt-line-' + i);
    if (line) {
      line.classList.toggle('done', step === 'debrief' || (typeof step === 'number' && i < step));
    }
  }
}

function ttNext(step) {
  const next = step + 1;
  if (next > 3) {
    ttFinish();
  } else {
    showTTStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function ttBack(step) {
  if (step === 'debrief') {
    showTTStep(3);
  } else {
    showTTStep(step - 1);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ttFinish() {
  state.ttCompleted = true;
  document.getElementById('nav-tabletop').classList.add('done');
  showTTStep('debrief');
  updateModuleProgress('tabletop');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════
   QUIZ
════════════════════════ */

function startQuiz() {
  state.qCurrent = 0;
  state.qScore = 0;
  state.wrongIds = [];
  state.quizStarted = true;
  state.currentScreen = 'quiz';

  document.getElementById('nav-results').disabled = true;
  showScreen('quiz');
  renderQuestion();
}

function renderQuestion() {
  const q = questions[state.qCurrent];
  const pct = (state.qCurrent / questions.length) * 100;

  document.getElementById('q-fill').style.width = pct + '%';
  document.getElementById('q-label').textContent = `Question ${state.qCurrent + 1} of ${questions.length}`;
  document.getElementById('q-score-display').textContent = state.qCurrent > 0 ? `Score: ${state.qScore}/${state.qCurrent}` : '';

  const vignetteHTML = q.scenario
    ? `<div class="q-vignette">${q.scenario}</div>`
    : '';

  const optionsHTML = q.options.map((opt, i) => `
    <button class="opt-btn" data-idx="${i}" onclick="pickOption(${i})" aria-label="Option ${['A','B','C','D'][i]}: ${opt.text}">
      <span class="opt-letter">${['A', 'B', 'C', 'D'][i]}</span>
      <span class="opt-text">${opt.text}</span>
    </button>
  `).join('');

  const isLast = state.qCurrent === questions.length - 1;

  document.getElementById('q-box').innerHTML = `
    <div class="q-card" role="article">
      <div class="q-card-header">
        <div class="q-category">${q.category}</div>
        <div class="q-incident">${q.incident}</div>
        <div class="q-text">${q.text}</div>
        ${vignetteHTML}
      </div>
      <div class="q-card-body">
        <div class="options" role="group" aria-label="Answer options">${optionsHTML}</div>
        <div class="feedback" id="q-feedback" role="alert"></div>
        <button class="btn-next" id="btn-next" onclick="advanceQuiz()">
          ${isLast ? 'See my results →' : 'Next question →'}
        </button>
      </div>
    </div>
  `;
}

function pickOption(idx) {
  const opts = document.querySelectorAll('.opt-btn');
  if (opts.length === 0 || opts[0].classList.contains('locked')) return;

  // Lock all
  opts.forEach(o => o.classList.add('locked'));

  const q = questions[state.qCurrent];
  const fb = document.getElementById('q-feedback');
  const isCorrect = q.options[idx].correct;

  if (isCorrect) {
    opts[idx].classList.add('correct');
    fb.className = 'feedback correct show';
    fb.innerHTML = `<strong>✓ Correct!</strong> ${q.feedbackRight}`;
    state.qScore++;
  } else {
    opts[idx].classList.add('wrong');
    q.options.forEach((opt, i) => {
      if (opt.correct) opts[i].classList.add('correct');
      else if (i !== idx) opts[i].classList.add('dimmed');
    });
    fb.className = 'feedback wrong show';
    fb.innerHTML = `<strong>✗ Not quite.</strong> ${q.feedbackWrong}`;
    state.wrongIds.push(q.id);
  }

  document.getElementById('btn-next').classList.add('show');
}

function advanceQuiz() {
  state.qCurrent++;
  if (state.qCurrent < questions.length) {
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showResults();
  }
}

function restartQuiz() {
  startQuiz();
}

/* ════════════════════════
   RESULTS
════════════════════════ */

function showResults() {
  state.currentScreen = 'results';

  // Fill progress bar to 100%
  document.getElementById('q-fill').style.width = '100%';

  // Enable results nav
  document.getElementById('nav-results').disabled = false;
  document.getElementById('nav-quiz').classList.add('done');

  showScreen('results');

  const total = questions.length;
  const score = state.qScore;
  const pct = score / total;

  // Score ring animation
  const circumference = 2 * Math.PI * 34; // r=34
  const offset = circumference * (1 - pct);
  document.getElementById('ring-label').textContent = `${score}/${total}`;

  setTimeout(() => {
    document.getElementById('ring-fill').style.strokeDashoffset = offset;
    if (pct >= 0.87) {
      document.getElementById('ring-fill').style.stroke = '#86EFAC';
    } else if (pct >= 0.6) {
      document.getElementById('ring-fill').style.stroke = '#FDE68A';
    } else {
      document.getElementById('ring-fill').style.stroke = '#FCA5A5';
    }
  }, 100);

  // Title and subtitle
  let title, sub;
  if (pct >= 0.87) {
    title = 'Security Expert 🏆';
    sub = `You got ${score} out of ${total}. Excellent instincts — keep this sharpness and share it with your team.`;
  } else if (pct >= 0.6) {
    title = 'Good Awareness 👍';
    sub = `You got ${score} out of ${total}. Solid understanding with a few areas to sharpen up:`;
  } else {
    title = 'Keep Learning 📚';
    sub = `You got ${score} out of ${total}. Attackers count on these gaps. The good news — now you know exactly what to work on:`;
  }

  document.getElementById('rh-title').textContent = title;
  document.getElementById('rh-sub').textContent = sub;

  // ── Certificate ──
  let grade;
  if (pct >= 0.87) grade = 'Expert';
  else if (pct >= 0.6) grade = 'Proficient';
  else grade = 'Participant';

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  document.getElementById('cert-score').textContent = `${score}/${total}`;
  document.getElementById('cert-grade').textContent = grade;
  document.getElementById('cert-date').textContent = today;
  // Keep any name already typed; otherwise placeholder
  updateCertName(state.userName);

  // Tips area
  const tipsArea = document.getElementById('r-tips');

  if (state.wrongIds.length === 0) {
    tipsArea.innerHTML = `
      <div class="all-correct">
        <p>🎯 Perfect score — every question right!</p>
        <span>Outstanding. The next step is making sure your team can do the same — share this module with them.</span>
      </div>
    `;
  } else {
    const wrongQuestions = questions.filter(q => state.wrongIds.includes(q.id));
    const cards = wrongQuestions.map(q => `
      <div class="tip-card">
        <div class="tip-incident">${q.incident}</div>
        <div class="tip-title">${q.tip.title}</div>
        <div class="tip-body">${q.tip.body}</div>
      </div>
    `).join('');

    tipsArea.innerHTML = `
      <div class="tips-section-label">Your personalised tips — based on what you got wrong (${state.wrongIds.length} area${state.wrongIds.length > 1 ? 's' : ''} to review)</div>
      ${cards}
    `;
  }
}

/* ════════════════════════
   CERTIFICATE
════════════════════════ */

function updateCertName(value) {
  state.userName = value;
  const clean = (value || '').trim();
  const nameEl = document.getElementById('cert-name');
  if (nameEl) nameEl.textContent = clean !== '' ? clean : 'Participant';
  // Keep the input in sync (e.g. when called programmatically)
  const input = document.getElementById('cert-name-input');
  if (input && input.value !== value) input.value = value || '';
}

function printCertificate() {
  const clean = (state.userName || '').trim();
  if (clean === '') {
    const input = document.getElementById('cert-name-input');
    if (input) {
      input.focus();
      input.style.borderColor = '#C84B2A';
      input.placeholder = 'Please enter your name first';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
    }
    return;
  }
  window.print();
}

/* ════════════════════════
   KEYBOARD NAVIGATION
════════════════════════ */

document.addEventListener('keydown', (e) => {
  // Close mobile menu on Escape
  if (e.key === 'Escape') {
    document.getElementById('mobile-nav').classList.remove('open');
  }
});

/* ════════════════════════
   INIT
════════════════════════ */

// Set initial nav state
document.getElementById('nav-home').classList.add('active');
