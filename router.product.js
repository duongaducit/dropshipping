const express = require('express');
const mongoose = require('mongoose');
const app = express();
const productRouter = express.Router();
const flectData = require('./service/flectdata-amz');
let Product = require('./model/ProductModel');
let ObjectID = require('mongodb').ObjectID;

productRouter.route('/get').get(function (req, res) {
    Product.find().then(function (productList, err) {
        if (err) {
          console.log(err);
        } else {
          res.json(productList);
        }
      });
});

productRouter.route('/save').post(function (req, res) {
    let product = new Product();
    product._id = new ObjectID();
    product.link_amz = 'https://www.amazon.com/Booms-Fishing-Aluminum-Remover-Cutting/dp/B07NQHFWLV/ref=sr_1_34?dchild=1&keywords=fishing&qid=1597417696&sr=8-34&th=1';
    
    
    product.rate_amze = '0';
    product.timeupdate = Date.now();

    product.template = '0';
    flectData(product.link_amz).then(rs => {
        product.asin_code = 'B07NQHFWLV';
        product.name_amz = rs.title;
        product.price_amz = rs.price;
        product.stock_amz = rs.availability;
        product.save();
        res.status(200).json(product);
    });
});

productRouter.route('/find').post(function (req, res) {
    let link_amz = req.body.link_product;
    let product = {
      link_product: link_amz
    }
    flectData(link_amz).then(rs => {
      product.asin_code = 'B07NQHFWLV';
      product.name_amz = rs.title;
      product.price_amz = rs.price;
      product.stock_amz = rs.availability;
      res.status(200).json(product);
  });
})
module.exports = productRouter;