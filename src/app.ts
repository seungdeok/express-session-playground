import express, { Express, Request, Response } from "express";
import nunjucks from "nunjucks";
import morgan from "morgan";
import session from "express-session";
import sessionFileStore from "session-file-store";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const port = 8080;

const FileStore = sessionFileStore(session);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "html");
nunjucks.configure("src/views", {
  express: app,
  watch: true,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {},
    store: new FileStore({ path: "./sessions" }),
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET || "default_secret"));

app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
