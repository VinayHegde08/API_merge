var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var bookModel = new Schema({
//     title: { type: String },
//     author: { type: String },
//     genre: { type: String },
//     read: { type: Boolean, default: false }
// });

var mindsDataSchema = new Schema({
    name: { type: String, required: true },
    mid: String,
    track: String
}, { collection: 'minds-data' });

module.exports = mongoose.model('MindsData', mindsDataSchema);