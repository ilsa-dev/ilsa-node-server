const path = require("path");

require('./database/provider/mysql.provider');

const express = require("express");

const cors = require("cors");
const morgan = require('morgan');
const helmet = require('helmet');

const bodyParser = require("body-parser");

// config
let {port, host} = require("./configuration/config");

global.logger = {
    info : function(msg){
        console.log(new Date() + ' - INFO: ' + msg);
    },
    error : function(msg){
        console.error(new Date() + ' - ERROR: ' + msg);
    }
};

const app = express();

app.use(bodyParser.json({limit: '32MB'}));

app.use(bodyParser.urlencoded({limit: '32MB', extended: true}));

app.use(cors());

app.use(morgan(function (tokens, req, res) {
    return [
        new Date(),
        '-',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}));

app.use(helmet());

// Angular DIST  output folder
//app.use(express.static(path.join(__dirname, "./dist")));

// routes
require("./routers/api")(app);

port = process.env.NODE_ENV === 'development' ? 4000 : port;
//set port
app.set("port", port);

//listen to server port
app.listen(port, () => console.log(`Server will run at http://${host}:${port}`));