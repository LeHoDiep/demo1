# Tailwind CSS Project

A modern Tailwind CSS project with PostCSS integration for building responsive web interfaces.

## Project Structure

```
├── src/
│   ├── css/
│   │   └── input.css (Tailwind directives)
│   ├── images/ (Your image assets)
│   │   └── .gitkeep
│   └── index.html (Source HTML)
├── dist/
│   ├── css/
│   │   └── output.css (Compiled Tailwind CSS)
│   ├── images/ (Copied image assets)
│   └── index.html (Built HTML)
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Mode

Watch for changes and rebuild CSS automatically, also copy images:

```bash
npm run dev
```

### 3. Build for Production

Create minified CSS and copy all images:

```bash
npm run build
```

### 4. Copy Images Only

Copy images with watch mode:

```bash
npm run copy-images
```

## Usage

Add Tailwind CSS utility classes to your HTML elements:

```html
<div class="bg-blue-500 text-white p-4 rounded-lg">Tailwind CSS Example</div>
```

## Configuration

- **tailwind.config.js**: Customize Tailwind theme, colors, and plugins
- **postcss.config.js**: Configure PostCSS processing
- **src/css/input.css**: Main CSS file with Tailwind directives

## Features

- ✓ Tailwind CSS v3.4.1
- ✓ PostCSS integration
- ✓ Watch mode for development
- ✓ Production build with minification
- ✓ Responsive design utilities

## Next Steps

1. Edit `src/index.html` to add your content
2. Use Tailwind classes to style your HTML
3. Run `npm run dev` to see changes in real-time
4. Build with `npm run build` when ready for production

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Utility-First CSS](https://tailwindcss.com/docs/utility-first)
