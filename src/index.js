const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySqlStore = require("express-mysql-session");
const passport = require("passport");

const { database } = require("./keys");

// Initializations (PAra inicializar modulos o la conexión a la base de datos)
const app = express();
require("./lib/passport");

// Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs({
	defaultLayout: "main",
	layoutDir: path.join(app.get("views"), "layouts"),
	partialsDir: path.join(app.get("views"), "partials"),
	extname: ".hbs",
	helpers: require("./lib/handlebars.js")
}));
app.set("view engine", ".hbs");

// Middlewares (se ejecuta cada vez que un usuario envia una peticion)
app.use(session({
	secret: "AngelJGR",
	resave: false,
	saveUninitialized : false,
	store: new MySqlStore(database)
}));
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));//ACeptar desde formulario los datos que envien los usuarios
app.use(express.json());//Para aceptar formatos json
app.use(passport.initialize());
app.use(passport.session());


// Global Variables
app.use((req, res, next) => {
	app.locals.success = req.flash("success");
	app.locals.message = req.flash("message");
	app.locals.user = req.user;
	next();
});


// Routes
app.use(require("./routes/"));
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));

// Public
app.use(express.static(path.join(__dirname, "public")));//Pagina estatica 

// Starting the Server
app.listen(app.get("port"), () => {
	console.log("Server listen on port", app.get("port"));
})