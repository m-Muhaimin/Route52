# 🧭 Route'52 — Premium Bangla Native AI Assistant

Route'52 is a highly polished, high-fidelity native artificial intelligence conversational interface tailored for Bangla and English speaking users. Styled with a custom **Atmospheric Forest-Cyberpunk** visual identity, Route'52 pairs state-of-the-art model configurations with seamless local and cloud synchronization.

---

## 🎨 Visual Identity & Design System

The application is engineered around strict, non-standard visual layouts documented in the [Design System Specification (DESIGN.md)](/DESIGN.md):
- **Aesthetic Theme**: Deep, organic forest-slate greens (`#090e0a`) coupled with luminous neon-green highlights (`#00ff66`).
- **Aesthetic Pairings**: Headings rendered in bold display typography pairing cleanly with technical monospace telemetry tags.
- **Glassmorphism**: Backdrop blur layouts combined with semi-transparent borders integrate component windows smoothly.

---

## 🚀 Key Features

### 1. Smart Dynamic Scroll-Lock
- **Adaptive Scroll Lock**: The active conversational feed tracks user scroll positions. If a user scrolls up to review historical statements, incoming streaming AI replies will **never** forcibly scroll them back to the bottom.
- **Auto-Snap**: Spontaneous snaps to the chat bottom are triggered on initiating brand-new prompts or switching chat threads.

### 2. Streamlined Profile & Settings Workspace
- **Basic Configuration**: Offers immediate full name customization, visual active model selections, and customizable default system instructions.
- **Security Updates**: Active users can seamlessly change and confirm passwords securely from the interface.
- **Decluttered Viewport**: Removed redundant third-party service connections (Supabase variables or n8n webhooks) to emphasize human, secure account administration.

### 3. Modular Navigation & Mobile Adaptability
- **Refined Mobile Sidebar**: Optimized sidebar rail transitioning cleanly from drawer containers on mobile touch screens to rigid side-panels on desktop platforms.
- **Welcome States**: Unauthenticated visitors are presented with a warm greeting card proposing simple activation prompts ("Get Started") to sync historical logs safely to the cloud.

### 4. Rich Content Renderer
- **Rich Markdown System**: Integrates full GFM support for tables, blockquotes, styled bullet points, and links.
- **Code Highlighting**: Features a dark code block theme equipped with single-click copy-to-clipboard buttons and custom syntactical colors for languages like Python, JavaScript, and TypeScript.

---

## 🛠️ Project Structure

The codebase is organized cleanly for performance and scalability:
- `src/App.tsx`: Main application viewport containing layout states, scroll listeners, and flow managers.
- `src/components/`:
  - `WelcomeScreen.tsx`: Feature introduction and guest mode CTA banner.
  - `SettingsView.tsx`: User profile editing and AI model behavior configurations.
  - `Sidebar.tsx`: Multi-thread tracker and view navigation controls.
  - `Header.tsx`: Context indicators and authentications.
  - `MarkdownRenderer.tsx`: Modular rich-text render parser.
  - `MessageBubble.tsx` / `HelpView.tsx`: Bubble components and tips.
- `src/lib/`:
  - `chatStorage.ts`: Intelligent thread persistence layers routing local browser caches to storage targets.
  - `supabase.ts`: Database connection manager.

---

## ⚡ Setup & Development

To run the application locally or in containers, make sure you have the required base dependencies ready.

### Installation
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Linting & Verification
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

---

## 📧 Email Notifications
For transaction messages, the visual specifications have been extended to HTML mailing cards. See the included [Signup Confirmation Template (confirm_signup.html)](/confirm_signup.html) for responsive, forest-neon styling parameters compatible across modern e-mail clients.
