const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BCEModel = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String
  },
  order_id: {
    type: String
  },
  link_track: {
    type: String
  },
  timestamp: {
    type : Date, default: Date.now
  }
}, {
    collection: 'bcemodel'
  })

module.exports = mongoose.model('bcemodel', MessageChatbox);