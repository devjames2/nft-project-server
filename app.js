import dotenv from "dotenv"
import express    from 'express'
import bodyParser from 'body-parser'
import mongoose   from 'mongoose'
import cors       from 'cors'
import session    from 'express-session'
import routes     from './routes/index.js'

const app = express();
// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// [CONFIGURE CORS]
app.use(cors())
// [CONFIGURE Express-session]
app.use(session({
    secret: '@#@$EOV29SDI#@2721V!',
    resave: false,
    saveUninitialized: true
   }));

dotenv.config();

// [CONFIGURE ROUTER]
// var router = require('./routes')(app, voucher)
// app.use('/items', itemRouter)
app.use('/', routes);

// CONNECT TO MONGODB SERVER
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

// [RUN SERVER]
// [CONFIGURE SERVER PORT]
const port = process.env.PORT || 8080;

var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});

process.once('SIGUSR2', function () {
  gracefulShutdown(function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});