# DebugInspector_React
During Vide Coding - A zero-config, drop-in utility for React developers that allows real-time inspection of components directly in the browser,


# ⚛️ React Heuristic Debug Inspector (v5.0)

A zero-config, drop-in utility for React developers that allows real-time inspection of components directly in the browser.

## 🚀 Overview
Most debuggers fail in production or CDN-based environments because React's `_debugSource` metadata is often stripped. This inspector uses **Heuristic Discovery** and **Fiber Reflection** to reconstruct the developer context.

## ✨ Features
- **Fiber Reflection**: Auto-maps DOM to Component instances.
- **Heuristic Discovery**: Infers module names when metadata is missing.
- **Live Props Sniffer**: Inspects real-time data flow.
- **Logic Snapshots**: Displays the `function.toString()` signature.

## ⌨️ Controls
- **Toggle**: `CTRL` + `SHIFT` + `D`
- **Lock Target**: `SPACEBAR`
