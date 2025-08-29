const express = require("express");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();

const aboutRoutes = require("./routes/about");
const contactRoutes = require("./routes/contact");
const workRoutes = require("./routes/work");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.disable("x-powered-by");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));

const scriptSrcUrls = [
  "https://kit.fontawesome.com/", // FA kit
  "https://cdn.jsdelivr.net", // Bootstrap CDN
];

const styleSrcUrls = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/", // Bootstrap
  "https://ka-f.fontawesome.com",
];

const fontSrcUrls = ["https://ka-f.fontawesome.com"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      connectSrc: ["'self'", "https://ka-f.fontawesome.com"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/doofnvidt/", // your Cloudinary
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/about", aboutRoutes);
app.use("/work", workRoutes);
app.use("/", contactRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.use((req, res, next) => {
  res.status(404);
  res.render("error", {
    extraStyles: ["error.css"],

    status: 404,
    message: "Sorry, the page you are looking for does not exist.",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render("error", {
    extraStyles: ["error.css"],
    status: err.status || 500,
    message: err.message || "Something went wrong on the server.",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Serving on port ${process.env.PORT}`);
});
