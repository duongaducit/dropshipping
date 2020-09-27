const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductModel = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  asin_code: {
    type: String
  },
  name_amz: {
    type: String
  },
  link_amz: {
    type: String
  },
  price_amz: {
    type: String
  },
  stock_amz: {
    type: String
  },
  rate_amze: {
    type: String
  },
  template: {
    type: String
  },
  timeupdate: {
    type : Date, default: Date.now
  }
}, {
    collection: 'product'
  })

module.exports = mongoose.model('product', ProductModel);