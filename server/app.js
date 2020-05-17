import path from "path";

import express from "express";

import { default as connectMongoDBSession } from "connect-mongodb-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import exphbs from "express-handlebars";
import logger from "morgan";
import session from "express-session";

import homeRouter from "./routes/home.js";
import registerRouter from "./routes/register.js";
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
  layoutsDir: path.join(__dirname, "../views/layouts/"),
  partialsDir: path.join(__dirname, "../views/partials/"),
});

app.use(express.static(path.join(__dirname, "../public")));

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use("/users", usersRouter);

export default app;
