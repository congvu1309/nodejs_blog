
const express = require('express');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const port = 3000;

const route = require('./routes');
const db = require('./config/db');
const { changeLayout } = require('./app/middlewares/changeLayoutMiddleware');

//Connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// Middleware
app.use(
    session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: false,
        cookie: { secret: false },
    })
);

app.use(fileUpload({
    limits: {
        fileSize: 10000000,
    },
    abortOnLimit: true,
}));

app.engine(
    'hbs',
    handlebars.engine({
        extname: 'hbs',
        helpers: {
            sum: (a, b) => a + b,
            ifCondition: (a, operator, b, options) => {
                console.log(a, b);
                switch (operator) {
                    case '==':
                        return a == b ? options.fn(this) : options.inverse(this);
                    case '===':
                        return a === b ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return a != b ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return a !== b ? options.fn(this) : options.inverse(this);
                    case '<':
                        return a < b ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return a <= b ? options.fn(this) : options.inverse(this);
                    case '>':
                        return a > b ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return a >= b ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return a && b ? options.fn(this) : options.inverse(this);
                    case '||':
                        return a || b ? options.fn(this) : options.inverse(this);
                    case 'eq':
                        return a.equals(b) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },
        },
        defaultLayout: 'main'
    })
);

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'resources', 'views'));

console.log("PATH: ", path.resolve(__dirname, 'resources', 'views'));

//Customize middleware
app.use(changeLayout);
app.use(flash());


//Routes initialization
route(app);

app.listen(port, () => { console.log(`Example app listening on port http://localhost:${port}`); });

module.exports = app;


