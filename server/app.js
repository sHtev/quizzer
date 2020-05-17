import path from "path";

import express from "express";

import { default as connectMongoDBSession } from "connect-mongodb-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import exphbs from "express-handlebars";
import hbars from "handlebars";
import ipa from "@handlebars/allow-prototype-access";
import logger from "morgan";
import session from "express-session";

import homeRouter from "./routes/home.js";
import registerRouter from "./routes/register.js";
import quizRouter from "./routes/quiz.js";
import roundRouter from "./routes/round.js";
import usersRouter from "./routes/users.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.DATABASE,
  collection: "quizSessions",
});

const app = express();
const hbs = exphbs.create({
  extname: "hbs",
  handlebars: ipa.allowInsecurePrototypeAccess(hbars),
  layoutsDir: path.join(__dirname, "../views/layouts/"),
  partialsDir: path.join(__dirname, "../views/partials/"),
  allowProtoPropertiesByDefault: true,
  helpers: {
    // Function to do basic mathematical operation in handlebar
    math: function (lvalue, operator, rvalue) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
      return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue,
      }[operator];
    },
  },
});

app.use(express.static(path.join(__dirname, "../public")));

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect("https://" + req.headers.host + req.url);
    } else {
      return next();
    }
  } else {
    return next();
  }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY,
    store: store,
  })
);

app.use("/", homeRouter);
app.use("/register", registerRouter);
app.use("/quiz", quizRouter);
app.use("/round", roundRouter);
app.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/");
});
app.use("/users", usersRouter);

export default app;
