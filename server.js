
const mongoose = require('mongoose');
const config = require('./DB');
const cors = require('cors');
let express = require('express');
//setup express app 
let app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

const productRouter = require('./router.product');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => { console.log('Database is connected');},
  err => { console.log('Cannot connect to the database' + err) }
);

var whitelist = ['http://localhost:4200', 'http://34.84.149.232', 'https://test.jpc-auction.vnext.work'];
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
        // callback(null, true)
    }
}
app.use(cors(corsOptions));
//basic route for homepage
app.get('/', (req, res) => {
    res.json('welcome to express app');
});

app.use('/product', productRouter);

app.get('/node/getaddress', (req, res) => {
    let zipcode = req.query.zipcode;
    getHTML(zipcode).then(rs => {
        res.status(200).json(rs);
    });
});

//server listens to port 8082
const server = app.listen(4040, (err) => {
    if (err)
        throw err;
    console.log('listening on port 8082');
});


