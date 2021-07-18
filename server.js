const path = require('path');

const debug = require("debug")("booking-website");
const bodyParser=require('body-parser');
const express = require('express');
const dotEnv = require('dotenv');
const passport = require('passport');
const mongoose = require('mongoose');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const connectDB = require('./config/db');
const winston = require('./config/winston');


dotEnv.config({ path: "./config/config.env" })

connectDB();
debug("Connected To Database");


require('./config/passport');

const app = express();

if (process.env.NODE_ENV === "development") {
    debug("Morgan Enabled");
    app.use(morgan("combined", { stream: winston.stream }))
}

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(session({
    secret: process.env.SERIAL_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use(express.static(path.join(__dirname, "public")))

app.use("/", require('./router/blog'))
app.use("/users", require('./router/users'))
app.use("/dashboard", require('./router/dashboard'))

app.use(require('./controllers/errorController').get404)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`host statrt ${process.env.NODE_ENV} port ${PORT}`))