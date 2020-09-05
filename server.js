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
const server = app.listen(8082, (err) => {
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

async function getHTML(productURL) {
    return new Promise(async (resolve, reject) => {
    const { data: html } = await axios.get(productURL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
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
    var product = {
        "title": title,
        "price": price,
        "stock": availability
    };
    return resolve(product);
    });
}


