# ⚛️ Debug Inspector (v1.0)

A zero-config, "Spectroscopy" utility for React developers and **Vibe Coders**. It bridges the gap between the visual UI and the raw source code.

## 🚩 The Problem
As AI-assisted development (Vibe Coding) becomes the standard, we face a new friction point: **The Source Gap.**

1.  **AI Hallucinations**: You ask an AI to "fix the padding on the card." Because the AI doesn't know *exactly* which component is rendered, it guesses. It modifies `Card.tsx` when the UI was actually using `HeroCard.tsx`.
2.  **Metadata Stripping**: In production, staging, or optimized environments (like AI Studio), React's `_debugSource` is often stripped. Standard dev tools go blind, leaving you to manually hunt through folders to find the right file.
3.  **Context Loss**: Vibe coders think in "UI Vibes," but AI needs "Source Truth." Without a direct map, the workflow breaks.

## 💡 The Solution: Heuristic Discovery
The **Debug Inspector** acts as a "Truth Layer" that sits on top of your app. 

Instead of relying on fragile metadata, it uses **Heuristic Analysis**:
*   **Fiber Reflection**: It deep-dives into the internal React Fiber tree to find the nearest functional boundary.
*   **Pattern Inference**: It analyzes the function's signature and stringified body to "reconstruct" the component's identity. 
*   **Why "Heuristic"?**: It’s called *Heuristic* because it doesn't just read a file path—it uses "rules of thumb" and discovery patterns to identify components even when the framework tries to hide them. It finds the truth when the data is missing.

## 🚀 Why this is a game-changer for Vibe Coders
*   **Zero Guesswork**: Hover over any element and immediately see its **Resolved Module Name** (e.g., `PublicHero.tsx`). No more searching.
*   **Hallucination Prevention**: Provide the exact filename to your AI. "Update the spacing in `IdeaCard.tsx`" is a 100% successful prompt; "Update the cards" is a 50/50 gamble.
*   **Direct Logic Inspection**: See the component's internal logic (the "Function Definition") and current `Props` directly in the browser. Copy the logic and feed it to your AI for hyper-accurate refactoring.

## ⌨️ Controls
- **Toggle Inspector**: `CTRL` + `SHIFT` + `D`
- **Lock Target**: `SPACEBAR` (Locks the focus so you can scroll the logic or copy code).
- **Close**: Click the `(X)` icon in the top right.

## 📦 Installation
Simply render the `<DebugInspector />` at the root of your application:

```tsx
import { DebugInspector } from './components/debug';

function App() {
  return (
    <>
      <DebugInspector />
      <MainAppContent />
    </>
  );
}
```

## 🛠 Prerequisites
*   **Tailwind CSS**: Required for the inspector's UI.
*   **Preserve Names**: For best results, ensure your bundler (Vite/Esbuild) is set to `keep-names`. If names are mangled, the inspector will see `a()` instead of `IdeaCard()`.
