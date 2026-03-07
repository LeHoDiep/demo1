const fs = require("fs");
const path = require("path");

const srcPagesDir = path.join(__dirname, "src", "pages");
const distPagesDir = path.join(__dirname, "dist", "pages");

// Create dist/pages if not exist
if (!fs.existsSync(distPagesDir)) {
  fs.mkdirSync(distPagesDir, { recursive: true });
}

function copyAndFlatten(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach((file) => {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      copyAndFlatten(fullPath);
    } else {
      // Copy files to flat dist/pages structure
      const destPath = path.join(distPagesDir, file.name);
      fs.copyFileSync(fullPath, destPath);
      console.log(`✓ Copied ${file.name}`);
    }
  });
}

console.log("Flattening src/pages/** to dist/pages/...");
copyAndFlatten(srcPagesDir);
console.log("✓ Flattening completed");
