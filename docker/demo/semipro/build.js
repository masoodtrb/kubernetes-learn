const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "dist");
fs.mkdirSync(outDir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Docker Demo — Semipro SPA</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main>
      <h1>Semipro: multi-stage build</h1>
      <p>این فایل‌ها در stage اول با Node ساخته شده‌اند و در stage دوم فقط با nginx سرو می‌شوند.</p>
      <p id="stamp"></p>
    </main>
    <script src="./app.js"></script>
  </body>
</html>
`;

const css = `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #042f2e, #0f766e);
  color: #ecfdf5;
}
main { text-align: center; padding: 2rem; max-width: 36rem; }
h1 { font-size: 1.6rem; }
p { opacity: 0.9; line-height: 1.7; }
`;

const js = `document.getElementById("stamp").textContent =
  "built-at: " + new Date().toISOString();
`;

fs.writeFileSync(path.join(outDir, "index.html"), html);
fs.writeFileSync(path.join(outDir, "styles.css"), css);
fs.writeFileSync(path.join(outDir, "app.js"), js);

console.log("build ok → dist/");
