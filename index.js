const express = require("express");
const app = express();
const port = 3001;
const entitiesRouter = require("./routes/entities");
const schemaRouter = require("./routes/schema-definitions");
const attributeRouter = require("./routes/attributes");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/schema", (req, res) => {
  res.json({ message: "testing" });
});

app.use("/schema/schema-definitions", schemaRouter);
app.use("/schema/attributes", attributeRouter);
app.use("/schema/entities", entitiesRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


// Following: https://blog.logrocket.com/build-rest-api-node-express-mysql/