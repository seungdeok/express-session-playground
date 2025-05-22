import express, { Express, Request, Response } from "express";
import nunjucks from "nunjucks";
import morgan from "morgan";

const app: Express = express();
const port = 8080;

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "html");
nunjucks.configure("src/views", {
  express: app,
  watch: true,
});

app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
