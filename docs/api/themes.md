# Theme System API

## ThemeManager Class

Manages terminal themes and visual appearance.

### Available Themes

- **matrix** - Classic green phosphor (default)
- **amber** - Vintage amber terminal
- **hacker** - Bright green on black
- **cyberpunk** - Neon colors

## Usage

### Setting Theme

```javascript
// In command
this.themeManager.setTheme('matrix');

// Via terminal command
theme matrix
```

### Theme Structure

```javascript
{
  name: 'matrix',
  background: '#0d0d0d',
  foreground: '#00ff41',
  cursor: '#00ff41',
  selection: '#003b00',
  // ... xterm.js theme colors
}
```

## Theme Persistence

Themes are saved to `localStorage`:

```javascript
localStorage.setItem('term-theme', 'matrix');
const savedTheme = localStorage.getItem('term-theme') || 'matrix';
```

## CSS Integration

Themes update CSS variables:

```css
:root {
  --term-color: #00ff41;
  --term-bg: #0d0d0d;
}
```

## Adding New Themes

1. Add theme definition to `themes.js`
2. Update theme list in help
3. Add CSS variables if needed

