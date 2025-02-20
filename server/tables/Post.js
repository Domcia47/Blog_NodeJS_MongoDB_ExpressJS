const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type:String,required:true},
    body: {type:String,required:true},
    createdDate: {type:Date,default: Date.now},
    updatedDate: {type:Date,default: Date.now},
    cathegory: {type:String}
});

module.exports = mongoose.model('Post', PostSchema);