const fs = require("fs");
const path = require("path");

const distPagesDir = path.join(__dirname, "dist", "pages");

// Cache file contents so shared files can be inlined into multiple HTMLs
const fileCache = {};
function readCached(filePath) {
  if (!fileCache[filePath]) {
    fileCache[filePath] = fs.readFileSync(filePath, "utf8");
  }
  return fileCache[filePath];
}

// Resolve asset path: try original, then fallback to same dir (after flatten)
function resolveAsset(htmlDir, relPath) {
  let full = path.resolve(htmlDir, relPath);
  if (fs.existsSync(full)) return full;
  full = path.join(htmlDir, path.basename(relPath));
  if (fs.existsSync(full)) return full;
  return null;
}

function inlineAssetsInHtml(htmlPath) {
  let html = fs.readFileSync(htmlPath, "utf8");
  const htmlDir = path.dirname(htmlPath);
  const inlinedFiles = [];

  // Inline CSS
  html = html.replace(
    /<link rel="stylesheet" href="(.+?\.css)"[^>]*>/g,
    (match, cssPath) => {
      const fullPath = resolveAsset(htmlDir, cssPath);
      if (fullPath) {
        inlinedFiles.push(fullPath);
        const css = readCached(fullPath);
        return `<style>\n${css}\n</style>`;
      }
      return match;
    },
  );

  // Inline JS
  html = html.replace(
    /<script src="(.+?\.js)"[^>]*><\/script>/g,
    (match, jsPath) => {
      const fullPath = resolveAsset(htmlDir, jsPath);
      if (fullPath) {
        inlinedFiles.push(fullPath);
        const js = readCached(fullPath);
        return `<script>\n${js}\n</script>`;
      }
      return match;
    },
  );

  fs.writeFileSync(htmlPath, html);
  console.log(`✓ Inlined assets for ${path.basename(htmlPath)}`);
  return inlinedFiles;
}

// Find and inline all HTML files, then clean up
function inlineHtmlFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const allInlinedFiles = new Set();

  files.forEach((file) => {
    const fullPath = path.join(dir, file.name);
    if (file.isFile() && file.name.endsWith(".html")) {
      const inlined = inlineAssetsInHtml(fullPath);
      inlined.forEach((f) => allInlinedFiles.add(f));
    }
  });

  // Delete inlined assets only if they are inside dist/pages (flattened copies)
  allInlinedFiles.forEach((filepath) => {
    const normalized = path.resolve(filepath);
    const pagesDir = path.resolve(distPagesDir);
    if (normalized.startsWith(pagesDir) && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log(`  → Deleted ${path.basename(filepath)}`);
    }
  });
}

if (fs.existsSync(distPagesDir)) {
  inlineHtmlFiles(distPagesDir);
  console.log("✓ All HTML files inlined and cleanup completed");
} else {
  console.log("dist/pages directory not found");
}
