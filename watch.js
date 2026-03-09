const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const srcPagesDir = path.join(__dirname, "src", "pages");

console.log("🔍 Watching src/pages for changes...");

// Use recursive watching
fs.watch(srcPagesDir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    console.log(`\n📝 Change detected: ${filename}`);
    console.log("🔄 Running flatten and inline...");

    exec("node flatten.js && node inline.js", (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error:", error);
        return;
      }
      console.log("✅ Done!");
    });
  }
});

// Keep the process running
process.on("SIGINT", () => {
  console.log("\n👋 Watcher stopped");
  process.exit(0);
});
