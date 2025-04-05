export default async function handlePost(model, req, res) {
  let isPostBody = "";
  req.on("data", (data) => {
    isPostBody += data;
  });

  req.on("end", () => {
    const isObj = JSON.parse(isPostBody);
    if (!Object.hasOwn(isObj, "name")) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "Send Request body" }));
    }
    (async () => {
      const hasExist = await model.exists({
        $or: [
          { name: { $regex: new RegExp(`^${isObj.name}`, "i") } },
          { email: { $regex: new RegExp(`^${isObj.email}`, "i") } },
        ],
      });
      if (hasExist !== null) {
        res.writeHead(400);
        return res.end(
          JSON.stringify({ error: "name or email already exists" })
        );
      }
      const lastId = await model.findOne().sort({ _id: -1 }).lean();
      const isId = lastId?.id ? lastId.id + 1 : 1;
      const toInsert = {
        id: isId,
        name: isObj.name,
        age: parseInt(isObj.age),
        email: isObj.email,
      };
      console.log(toInsert);
      const toCreate = await model.create([toInsert], { ordered: true });
      if (!toCreate) {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: "Failed to submit user" }));
      }
      res.writeHead(201);
      return res.end(JSON.stringify({ success: "The user is submitted" }));
    })();
  });
}
