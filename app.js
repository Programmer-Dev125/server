import { createServer } from "http";

const data = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
];
createServer((req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader(
    "access-control-allow-methods",
    "GET, POST, DELETE, POST, OPTIONS"
  );
  res.setHeader("content-type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }
  switch (req.method) {
    case "GET":
      {
        res.writeHead(200);
        res.end(JSON.stringify(data));
      }
      break;
    case "POST":
      {
        let body = "";
        req.on("data", (data) => {
          body += data;
        });
        req.on("end", () => {
          const isObj = JSON.parse(body);
          data.push({ id: data.length + 1, ...isObj });
          res.writeHead(200);
          return res.end(JSON.stringify({ users: data }));
        });
      }
      break;
    default:
      res.writeHead(405);
      return res.end(JSON.stringify({ error: "Invalid Request Method" }));
  }
}).listen(process.env.PORT || 3000);
