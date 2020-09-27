const express = require('express');
const app = express();
const productRouter = express.Router();
const flectData = require('./service/flectdata-amz');

productRouter.route('/find').post(function (req, res) {
    let link_amz = req.body.link_product;
    let asinList = link_amz.match(/\/dp\/(.*?)\//s);
    if (!asinList || asinList.length < 2) {
      res.status(400).json(null);
      return;
    }

    let asin = asinList[1];
    let product = {
      link_product: link_amz,
      asin_product: asin
    }
    flectData(link_amz).then(rs => {
      product.name_amz = rs.title;
      product.price_amz = rs.price;
      product.stock_amz = rs.availability;
      product.image_list = rs.image_list;
      product.description = rs.description;
      res.status(200).json(product);
  });
})
module.exports = productRouter;