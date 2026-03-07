const fs = require("fs");
const path = require("path");

const distPagesDir = path.join(__dirname, "dist", "pages");

function inlineAssetsInHtml(htmlPath) {
  let html = fs.readFileSync(htmlPath, "utf8");
  const htmlDir = path.dirname(htmlPath);
  const assetsToDelete = [];

  // Inline CSS
  html = html.replace(
    /<link rel="stylesheet" href="(.+?\.css)"[^>]*>/g,
    (match, cssPath) => {
      const fullCssPath = path.resolve(htmlDir, cssPath);
      if (fs.existsSync(fullCssPath)) {
        // Delete local CSS files only (same directory)
        if (fullCssPath.startsWith(htmlDir)) {
          assetsToDelete.push(fullCssPath);
        }
        const css = fs.readFileSync(fullCssPath, "utf8");
        return `<style>\n${css}\n</style>`;
      }
      return match;
    },
  );

  // Inline JS
  html = html.replace(
    /<script src="(.+?\.js)"[^>]*><\/script>/g,
    (match, jsPath) => {
      const fullJsPath = path.resolve(htmlDir, jsPath);
      // Only inline and delete local JS files (in same directory)
      if (fs.existsSync(fullJsPath) && fullJsPath.startsWith(htmlDir)) {
        assetsToDelete.push(fullJsPath);
        const js = fs.readFileSync(fullJsPath, "utf8");
        return `<script>\n${js}\n</script>`;
      }
      return match;
    },
  );

  fs.writeFileSync(htmlPath, html);
  console.log(`✓ Inlined assets for ${path.basename(htmlPath)}`);

  // Delete original CSS and JS files
  assetsToDelete.forEach((filepath) => {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log(`  → Deleted ${path.basename(filepath)}`);
    }
  });
}

// Find and inline all HTML files in dist/pages root level
function inlineHtmlFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach((file) => {
    const fullPath = path.join(dir, file.name);
    if (file.isFile() && file.name.endsWith(".html")) {
      inlineAssetsInHtml(fullPath);
    }
  });
}

if (fs.existsSync(distPagesDir)) {
  inlineHtmlFiles(distPagesDir);
  console.log("✓ All HTML files inlined and cleanup completed");
} else {
  console.log("dist/pages directory not found");
}
