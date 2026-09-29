const http = require("http");

const port = Number(process.env.PORT || 3000);

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.url === "/api/hello" || req.url === "/") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        message: "سلام از mock API داخل Compose",
        service: "mock-api",
        time: new Date().toISOString(),
      })
    );
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(port, "0.0.0.0", () => {
  console.log(`mock-api listening on ${port}`);
});
