export default async function handleDelete(model, req, res) {
  const isId = parseInt(req.headers["x-del-id"]);
  if (!isId) {
    res.writeHead(400);
    return res.end(
      JSON.stringify({ error: "The x-del-id header is not present" })
    );
  }
  const hasUser = await model.find({ id: isId }, { __v: 0 });
  if (!hasUser.length) {
    res.writeHead(204);
    return res.end();
  }
  const toDelete = await model.findOneAndDelete({ id: isId });
  if (!toDelete) {
    res.writeHead(500);
    return res.end(
      JSON.stringify({ error: "server failed to delete the user" })
    );
  }
  res.writeHead(200);
  return res.end(JSON.stringify({ success: "user deleted successfully" }));
}
