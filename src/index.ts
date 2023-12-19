import express from "express";
import { intervalsRoute } from "./routes/intervals";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/intervals", intervalsRoute);

app.all("/*", (request, response) => {
  return response.sendStatus(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`👂 Listening on port ${port}...`);
});
