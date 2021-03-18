var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var event = new Schema({
    title:{type:String, required:true },
    summary:{type:String, required: true },
    host:{type:String, required:true},
    start_date:{type:Date},
    end_date:{type:Date},
    category:[{type:String}],
    location:String,
    likes:{type:Number, default:0},
    remarks:[{type:Schema.Types.ObjectId, ref:'Remark'}],
}, {
    timestamps:true,
}) 

module.exports = mongoose.model('Event', event);