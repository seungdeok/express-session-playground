import express, { Express, Request, Response } from "express";
import nunjucks from "nunjucks";
import morgan from "morgan";
import session from "express-session";
import sessionFileStore from "session-file-store";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { createUser, users } from "./models/User";
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
  autoescape: true, // xss 공격
  express: app,
  watch: process.env.NODE_ENV === "development",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false, // 세션 데이터 변경 여부와 상관없이 매 요청마다 저장여부를 결정
    saveUninitialized: true, // 초기화되지 않은 세션을 저장소에 저장
    cookie: {
      httpOnly: true, // xss 공격
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24시간
    },
    store: new FileStore({ path: "./sessions", retries: 0 }),
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET || "default_secret"));
app.use(helmet.xssFilter()); // xss 공격
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'"],
      "img-src": ["'self'"],
    },
  })
); // xss 공격

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

app.post("/register", async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.render("register.html", {
      error: "모든 필드를 입력해주세요.",
    });
  }

  if (password !== confirmPassword) {
    return res.render("register.html", {
      error: "비밀번호가 일치하지 않습니다.",
    });
  }

  if (users.find((user) => user.username === username)) {
    return res.render("register.html", {
      error: "이미 존재하는 사용자명입니다.",
    });
  }

  if (users.find((user) => user.email === email)) {
    return res.render("register.html", {
      error: "이미 존재하는 이메일입니다.",
      success: null,
    });
  }

  createUser(username, email, password);

  res.render("login.html", {
    error: null,
  });
});

app.get("/login", isAuthenticated, (req: Request, res: Response) => {
  res.render("login.html", { error: null });
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login.html", {
      error: "이메일과 비밀번호를 입력해주세요.",
    });
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.render("login.html", {
      error: "존재하지 않는 사용자입니다.",
    });
  }

  const isValidPassword = password === user.password; // 비밀번호 검증 로직을 추가해야 합니다.
  if (!isValidPassword) {
    return res.render("login.html", {
      error: "비밀번호가 올바르지 않습니다.",
    });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };

  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      return res.status(500).send("세션 저장 중 오류가 발생했습니다.");
    }

    res.redirect("/");
  });
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
  console.log(`🔑 기본 로그인 정보: admin@admin.com / admin`);
});
