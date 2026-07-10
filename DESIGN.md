# Route'52 — Design System Specification

Welcome to the official design system documentation for **Route'52**, a premium, highly polished Bangla native conversational assistant interface.

---

## 🌌 Visual Identity & Mood

The visual concept of Route'52 is **Atmospheric Forest-Cyberpunk**—coupling deep, organic forest-slate greens with luminous neon accents. It communicates safe, high-fidelity native artificial intelligence tailored specifically for Bangla speaking users.

- **Negative Space**: Generous, intentional padding (`p-4` to `p-8`) is employed to let interfaces breathe and prevent typical "AI dashboard clutter."
- **Focus Elements**: Rather than multiple heavy boxes, cards are subtly defined using semi-transparent borders and atmospheric glows, positioning focus entirely on user-authored input and clear response blocks.
- **Glassmorphism**: Surfaces utilize subtle backdrop filters (`backdrop-filter: blur(12px)`) combined with dark transparency to merge layers cleanly.

---

## 🎨 Color Palette & Tokens

Route'52 relies on the following bespoke design tokens built on top of Tailwind CSS v4 variables:

### Core Backgrounds
*   **Base Background (`#090e0a`)**: A luxurious, deep forest-black slate background optimized for organic eye-comfort during long sessions.
*   **Surface Lowest (`#050806`)**: Pure background depth for absolute container contrast.
*   **Surface Container Low (`#0d1410`)**: The base container tone used for navigation panels, sidebars, and inactive segments.
*   **Surface Container Medium (`#121b15`)**: Used for message blocks, input bars, and secondary modules.
*   **Surface Container High (`#1a261f`)**: Selected for active buttons, hover states, and highlighted elements.

### Brand Accents
*   **Primary Active (`#00ff66`)**: A vibrant, high-contrast neon green. It serves as the primary visual anchor for brand logos, micro-indicators, active state highlights, and primary clickables.
*   **On-Primary Contrast (`#003311`)**: Deep forest-green designed for maximum readability of text nested inside Primary elements.
*   **Tertiary Highlight (`#39ff14`)**: Vibrant cyberpunk lime-green utilized for secondary progress metrics and status tags.

### Borders & Typography
*   **Text (On-Surface) (`#e2f0e6`)**: A crisp, clean off-white mint tone for maximum readable contrast without screen glare.
*   **Text Variant (`#9fbfa9`)**: Warm sage grey for meta-text, labels, and helper descriptions.
*   **Outline-Variant (`#2d3d33`)**: Forest border lines designed to merge cards subtly into the base dark canvas.

---

## ✍️ Typography & Hierarchies

Route'52 pairs three distinct font families to build dynamic structural rhythms:

1.  **Display & Headings**: `Geist` (backed by `Inter` fallback) — Extra bold (`font-extrabold` to `font-black`), low tracking (`tracking-tight`), low line-height (`leading-snug`). Conveys immediate authority and clean tech.
2.  **General Interface & Body**: `Inter` — High legibility sans-serif with optimized line-height for English & Bengali scripts.
3.  **Data, Indicators & Code**: `JetBrains Mono` — High density monospace for system statuses, copy actions, metadata, and syntax-highlighted code blocks.

---

## 🧩 Key Components & Layouts

### 1. Dual-Scroll Lock Container
*   The primary layout employs a rigid height layout preventing global body scrolls.
*   The chat feed panel maintains a separate, auto-scrolling viewport with an active smart scroll-lock (allowing users to review history without jumping to the bottom on active streaming updates).

### 2. Fixed Atmospheric Input Bar
*   The prompt input box sits fixed at the absolute bottom.
*   Wrapped in a multi-layered gradient backdrop fading from the base background (`#090e0a`) to transparent, creating a soft shadow layer that floats beautifully over scrolling message bubbles.

### 3. Sidebar Navigation
*   Refined, responsive mobile navigation that smoothly transitions from slide-out drawer on small viewports to a persistent structural rail on desktops.

---

## 📧 Email Template Design Rules
Any transactional or system notifications (such as sign-up confirmations) MUST adhere to the **Route'52** visual brand rules:
*   Use background color `#090e0a`.
*   Nest content in a central glassmorphic card container with border colors matching `#2d3d33`.
*   Anchor primary call-to-action buttons with background color `#00ff66` and text color `#003311`.
*   Render headers in crisp sans-serif with subtle neon accents.
