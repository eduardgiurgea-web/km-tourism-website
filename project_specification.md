# Project Specification: Premium Luxury Landing Page Template

This document captures the technical requirements, design patterns, and implementation history for the KM Tourism Dubai project. This can be used to "train" an AI agent (like Claude Code) to recreate this exact aesthetic and functional logic for future clients.

## 1. Visual Identity & Aesthetic
- **Vibe**: Ultra-exclusive, premium, "Dubai Desert Luxury".
- **Color Palette**: 
  - Gold Accent: `#c9a84c` / `#d6ba6b`
  - Deep Black/Gold background: Sleek, dark mode by default.
  - "Deserty" lightness: Background sections are kept slightly lighter (10-20% lighter than pure black) using soft gradients.
- **Typography**: Elegant, high-contrast serif/sans-serif mix (e.g., Apple-style precision).
- **Global Effects**: 
  - **Golden Pulse**: A fixed `body::after` element that creates a subtle glowing gold margin pulsing every 2 seconds.
  - **Glassmorphism**: Heavy use of `backdrop-filter: blur(10px)` for headers and buttons.

## 2. Core Components

### Hero Section
- **Video Background**: Canvas-based image sequence (JPGs) for smooth performance.
- **Text Animation**: "Flying Letters" effect where each character/word slides into place from different directions.
- **Particle Layer**: Subtle floating gold particles overlaying the video.

### Curated Services (Horizontal/Vertical Cards)
- **Desktop**: 5 cards in a row. Outer cards fly in from screen edges (Top, Bottom, Left, Right) to assemble in the center upon scroll.
- **Mobile**: Vertical stack. Cards are dimmed/grayscale by default.
- **IntersectionObserver Logic**: As the user scrolls on mobile, the card in the center "wakes up"—it gains a golden glow, lightens up (removes grayscale), and scales up slightly (1.02x).

### About Us Section
- **Background**: High-quality image sequence loop (Canvas) running at a lower frame rate (8fps desktop, 4fps mobile) to avoid distracting from the text.
- **Overlay**: Dark frosted glass overlay over the video to ensure text readability.

## 3. Mobile Navigation & Responsiveness
- **Burger Menu**: Standard 3-line hamburger menu for navigation.
- **Mobile CTA**: The "Request an instant call back" button is pinned/moved directly under the logo/burger row, spanning full width with a persistent golden glow.
- **Screen Flow**: 1 section visible at a time on mobile, ensuring a premium "Apple-style" presentation.

## 4. Key Implementation Patterns (JS/CSS)

### Card Glow Observer (JS)
```javascript
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('mobile-active-glow');
        } else {
            entry.target.classList.remove('mobile-active-glow');
        }
    });
}, { threshold: 0.5 });
```

### Pulse Margin (CSS)
```css
@keyframes pulseMarginGlow {
  0% { box-shadow: inset 0 0 10px rgba(214, 186, 107, 0.1); }
  50% { box-shadow: inset 0 0 35px rgba(214, 186, 107, 0.4); }
  100% { box-shadow: inset 0 0 10px rgba(214, 186, 107, 0.1); }
}
body::after {
  content: "";
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 9999;
  animation: pulseMarginGlow 2s infinite ease-in-out;
}
```

## 5. Deployment Flow
- **Git**: Hosted on GitHub.
- **Netlify**: Connected via GitHub for automatic deployment on every push/commit.
