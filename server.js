const axios = require('axios');
const cherrio = require('cheerio');

const puppeteer = require('puppeteer');
let express = require('express');
//setup express app 
let app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
let http = require('http');

var cors = require('cors');

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

app.get('/node/getaddress', (req, res) => {
    let zipcode = req.query.zipcode;
    getHTML(zipcode).then(rs => {
        res.status(200).json(rs);
    });
});

//server listens to port 8082
const server = app.listen(80, (err) => {
    if (err)
        throw err;
    console.log('listening on port 8082');
});

function run(link) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(link);
            let urls = await page.evaluate(() => {
                let title = document.body.querySelector('#productTitle').innerText;
                let price = document.body.querySelector('#priceblock_ourprice');
                if (!price) {
                    price = document.body.querySelector("#priceblock_saleprice")
                }

                let availability = document.body.querySelector('#availability');
                var product = {
                    "title": title,
                    "price": price && price.innerText,
                    "stock": availability && availability.innerText
                };

                return product;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
var agentconst = ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4'];
async function getHTML(productURL) {
    var idx = Math.floor(Math.random() * 4);
    var agent = agentconst[idx];
    return new Promise(async (resolve, reject) => {
    const { data: html } = await axios.get(productURL, {
        headers: {
            'User-Agent': agent
        }
    })
        .catch(function (error) {
            return reject(error);
        });
    const $ = cherrio.load(html);
    let title = $('#productTitle').text().replace(/\n/g,'');
    let price = $('#priceblock_ourprice').text().replace(/\n/g,'');
    if (!price) {
        price = $("#priceblock_saleprice").text().replace(/\n/g,'');
    }

    let availability = $('#availability').text().replace(/\n/g,'');
    var product = [title,price,availability];
    return resolve(product);
    });
}


