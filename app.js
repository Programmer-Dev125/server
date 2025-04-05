import mongoose, { Schema } from "mongoose";
import { createServer } from "node:http";
import handleRead from "./read/read.js";
import handlePost from "./create/create.js";
import handleUpdate from "./update/update.js";
import handleDelete from "./delete/delete.js";

async function handleDb() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
  }
}

const schemaOptions = {
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
};
const model = mongoose.model(
  "isModel",
  new Schema(schemaOptions, { autoIndex: false, autoCreate: false }),
  "user"
);

createServer(async (req, res) => {
  await handleDb();

  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, POST, DELETE, PUT");
  res.setHeader(
    "access-control-allow-headers",
    "content-type, x-put-id, x-del-id"
  );
  res.setHeader("content-type", "application/json");

  switch (req.method) {
    case "OPTIONS":
      res.writeHead(200);
      res.end();
      break;
    case "GET":
      handleRead(model, res);
      break;
    case "POST":
      handlePost(model, req, res);
      break;
    case "PUT":
      handleUpdate(model, req, res);
      break;
    case "DELETE":
      handleDelete(model, req, res);
      break;
    default:
      break;
  }
}).listen(process.env.PORT || 3000);
