# AGENTS.md - RuletaBKS Development Guide

This document provides guidelines for agentic coding assistants working in this codebase.

## Project Overview

RuletaBKS is a League of Legends-inspired team draft roulette application built with:
- **React 19** with JSX (no TypeScript)
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **@hello-pangea/dnd** for drag-and-drop functionality
- **ESLint 9** for code linting

## Build/Lint/Test Commands

All commands must be run from the `ruletaBKS/` directory:

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Run ESLint (checks all .js and .jsx files)
npm run lint
```

### Running a Single Test

This project does **not** have a test suite configured. If tests are added in the future, run them with:

```bash
npm test
```

## Code Style Guidelines

### File Organization

- **Components**: `src/components/<Category>/<Name>.jsx`
- **Context**: `src/context/<Name>Context.jsx`
- **Assets**: `src/assets/`
- **Styles**: `src/index.css` (main entry, contains Tailwind config)
- **Entry point**: `src/main.jsx`
- **Root component**: `src/App.jsx`

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase, `.jsx` | `TeamPanel.jsx` |
| Context | PascalCase + Context suffix | `GameContext.jsx` |
| Context exports | PascalCase | `GameProvider`, `GameContext` |
| Functions | camelCase | `handleSpin`, `playSound` |
| Variables | camelCase | `isSpinning`, `activePlayers` |
| Constants | camelCase | `FRIENDS_LIST` |
| CSS classes | kebab-case (Tailwind) | `text-lol-gold`, `bg-lol-blue` |
| Custom theme colors | kebab-case, `lol-` prefix | `lol-bg`, `lol-gold`, `lol-blue` |

### React Patterns

**Context usage:**
```jsx
import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';

export default function Component() {
  const { state, updateFn } = useContext(GameContext);
  // ...
}
```

**Component structure:**
```jsx
// src/components/Category/ComponentName.jsx
import { useState } from 'react';

export default function ComponentName({ prop1, prop2 }) {
  const [internalState, setInternalState] = useState(initialValue);
  
  // Handlers above JSX
  const handleAction = () => { /* ... */ };
  
  return (
    <div className="...">
      {/* JSX content */}
    </div>
  );
}
```

**File header comment (Spanish):**
```jsx
// src/components/Category/Component.jsx
// Component description or purpose
import { useContext } from 'react';
```

### Tailwind CSS v4 Guidelines

**Custom theme colors** (defined in `src/index.css`):
```css
@theme {
  --color-lol-bg: #010a13;
  --color-lol-blue: #0ac8b9;
  --color-lol-gold: #c89b3c;
  --color-lol-goldLight: #f0e6d2;
  --color-lol-gray: #0a1428;
  --color-lol-border: #3c3c41;
  --color-lol-red: #ff4655;
}
```

**Usage:**
- Use `bg-lol-*`, `text-lol-*`, `border-lol-*` for custom colors
- Use `lol-` prefix without hyphens in CSS class context
- Keep complex Tailwind classes on single lines when possible

### ESLint Configuration

The project uses ESLint flat config (`eslint.config.js`) with:
- **ESLint recommended rules**
- **react-hooks** plugin (recommended config)
- **react-refresh** plugin for Vite HMR compatibility
- **Custom rule**: `no-unused-vars` ignores variables starting with uppercase (intentional pattern)

**To auto-fix lint issues:**
```bash
npm run lint -- --fix
```

### Import Order

1. React imports (`react`)
2. Context/State imports
3. Third-party library imports
4. Internal component imports
5. Asset imports (images, audio, CSS)

```jsx
import { useState } from 'react';
import { GameContext } from '../../context/GameContext';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Header from './components/Layout/Header';
import spinAudio from '../assets/spin.mp3';
import './Component.css';
```

### Error Handling

**Sound/async operations:**
```jsx
const playSound = (type, name) => {
  try {
    const sound = new Audio(audioSrc);
    sound.play();
  } catch (error) {
    console.error("Error al reproducir:", error);
  }
};
```

**Clipboard operations:**
```jsx
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  } catch (err) {
    console.error('Error:', err);
    alert("Failed to copy");
  }
};
```

### Component Props

- Destructure props in function signature: `function Component({ prop1, prop2 })`
- Use default values for optional props when sensible
- Pass context values as separate variables, not inline destructuring in JSX

### State Management

- Use React Context (`GameContext`) for global state
- Use local `useState` for component-specific state
- Avoid prop drilling for shared state - use context instead

## Development Workflow

1. **Start dev server**: `npm run dev` (runs on port 5173 by default)
2. **Make changes** - hot reload is enabled
3. **Lint before committing**: `npm run lint`
4. **Build for production**: `npm run build`

## Vite Configuration

Located at `ruletaBKS/vite.config.js`:
- Uses `@vitejs/plugin-react` for React support
- Uses `@tailwindcss/vite` for Tailwind CSS v4 integration
- React compiler (babel-plugin-react-compiler) is enabled

## Common Patterns in This Codebase

**Dynamic class names based on props:**
```jsx
const borderColor = isBlue ? 'border-lol-blue' : 'border-lol-red';
```

**Array mapping for lists:**
```jsx
{roster.map((player, index) => (
  <PlayerCard key={index} player={player} isBlue={isBlue} />
))}
```

**Audio playback with imports:**
```jsx
import spinAudio from '../assets/spin.mp3';
// Usage: new Audio(spinAudio).play()
```

**Audio glob import for multiple files:**
```jsx
const announcerVoices = import.meta.glob('../assets/invocadores/**/*.mp3', { eager: true });
```
