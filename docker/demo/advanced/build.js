const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "dist");
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "index.html"),
  `<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>Docker Demo — Advanced</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: linear-gradient(150deg, #1c1917, #44403c);
        color: #fafaf9;
      }
      main { text-align: center; padding: 2rem; max-width: 40rem; }
      code { background: rgba(255,255,255,.12); padding: .15rem .4rem; border-radius: 4px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Advanced Dockerfile tips</h1>
      <p>غیر root، <code>.dockerignore</code>، و ترتیب لایه برای cache بهتر.</p>
    </main>
  </body>
</html>
`
);

console.log("advanced build ok → dist/");
