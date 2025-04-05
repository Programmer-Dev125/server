export default async function handleUpdate(model, req, res) {
  const isId = parseInt(req.headers["x-put-id"]);

  if (!isId) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "The x-put-id is not present" }));
  }

  let isPutData = "";
  req.on("data", (data) => {
    isPutData += data;
  });
  req.on("end", () => {
    const isPutObj = JSON.parse(isPutData);
    (async () => {
      const isDuplicate = await model.find({ id: isId }, { _id: 0, __v: 0 });
      if (!isDuplicate) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Invalid Id" }));
      }
      for (let i = 0; i < isDuplicate.length; i++) {
        if (
          isDuplicate[i].name === isPutObj.name &&
          isDuplicate[i].age === parseInt(isPutObj.age) &&
          isDuplicate[i].email === isPutObj.email
        ) {
          res.writeHead(204);
          return res.end();
        }
      }

      console.log(isPutObj, isDuplicate);
      const toUpdate = await model.updateOne(
        { id: isId },
        {
          name: isPutObj.name,
          age: parseInt(isPutObj.age),
          email: isPutObj.email,
        }
      );
      if (!toUpdate) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Failed to update data" }));
      }
      console.log(toUpdate);
      res.writeHead(200);
      return res.end(JSON.stringify({ success: "user has been updated" }));
    })();
  });
}
