import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import checkLicense from "./handlers/checkLicense";
import getById from "./handlers/getById";
import getByTags from "./handlers/getByTags";
import getTags from "./handlers/getTags";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
    origin(requestOrigin, callback) {
      callback(null, requestOrigin);
    },
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.sendStatus(200);
});
app.get("/tags", getTags);
app.get("/mockups", getByTags);
app.get("/mockup/:id", getById);

app.use("/assets", checkLicense);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../assets"), { extensions: ["png", "jpg", "jpeg"] })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
