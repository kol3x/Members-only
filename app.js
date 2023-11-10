const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");

const indexRouter = require("./routes/index");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const messageRouter = require("./routes/message");
const activationRouter = require("./routes/activation");

const mongoDb =
  "mongodb://admin:NHYmcTEQYYWbGtje@ac-k6rrd3d-shard-00-00.boo06k9.mongodb.net:27017,ac-k6rrd3d-shard-00-01.boo06k9.mongodb.net:27017,ac-k6rrd3d-shard-00-02.boo06k9.mongodb.net:27017/?ssl=true&replicaSet=atlas-pylas4-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      const match = await bcrypt.compare(password, user.password);
      if (!(match && user)) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect username or password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/sign-up", signupRouter);
app.use("/login", loginRouter);
app.use("/new-message", messageRouter);
app.use("/activation", activationRouter)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000);
