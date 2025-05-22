import express, { Express, Request, Response } from "express";
import nunjucks from "nunjucks";
import morgan from "morgan";
import session from "express-session";
import sessionFileStore from "session-file-store";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { isAuthenticated } from "./middlewares/isAuthenticated";
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
  const { user } = req.session;

  if (user) {
    res.render("index.html", { user });
    return;
  }

  res.render("login.html", { error: null });
});

app.get("/register", isAuthenticated, (req: Request, res: Response) => {
  res.render("register.html", { error: null, success: null });
});

app.get("/login", isAuthenticated, (req: Request, res: Response) => {
  res.render("login.html", { error: null });
});

app.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).send("로그아웃 처리 중 오류가 발생했습니다.");
    }

    res.redirect("/");
  });
});

app.use((req, res) => {
  res.status(404).send("페이지를 찾을 수 없습니다.");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`🔑 기본 로그인 정보: admin / admin`);
});
