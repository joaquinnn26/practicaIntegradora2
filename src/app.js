import express from "express";
import cookieParser from "cookie-parser";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import cookieRouter from "./routes/cookie.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import session from "express-session";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/cart.router.js";
import "./db/configDB.js";
import fileStore from "session-file-store";
const FileStore = fileStore(session);
import MongoStore from "connect-mongo";
import "./passport.js"
import passport from "passport";

//app express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser("SecretCookie"));

// session
//file
// app.use(
//   session({
//     store: new FileStore({
//       path: __dirname + "/sessions",
//     }),
//     secret: "secretSession",
//     cookie: { maxAge: 60000 },
//   })
// );

//mongo
const URI =
  "mongodb+srv://joaquinfefe:ecommercecoder@ecommerce.gmltjrj.mongodb.net/?retryWrites=true&w=majority";
app.use(
  session({
    store: new MongoStore({
      mongoUrl: URI,
    }),
    secret: "secretSession",
    cookie: { maxAge: 60000 },
  })
);
//passport
app.use(passport.initialize());
app.use(passport.session());
// handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// routes
app.use("/", viewsRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);

// app.get("/crear", (req, res) => {
//   res
//     .cookie("cookie1", "primeraCookie", { maxAge: 120000 })
//     .send("Probando cookies");
// });

// app.get("/crearFirmada", (req, res) => {
//   res
//     .cookie("cookie2", "cookieFirmada", { maxAge: 120000, signed: true })
//     .send("Creando firmada");
// });

// app.get("/leer", (req, res) => {
//   const { cookie1 } = req.cookies;
//   const { cookie2 } = req.signedCookies;
//   res.json({ cookies: cookie1, signedCookies: cookie2 });
// });

// app.get("/eliminar", (req, res) => {
//   res.clearCookie("cookie1").send("Eliminando cookie");
// });

app.listen(8080, () => {
  console.log("Escuchando al puerto 8080");
});
