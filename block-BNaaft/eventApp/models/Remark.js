var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var remarks = new Schema({
    title:{type:String, require:true},
    name:{type:String, required:true},
    likes:{type:Number,default:0},
    eventId:{type:Schema.Types.ObjectId, ref:'Events' ,require:true}
    
},{
    timestamps:true
})

module.exports = mongoose.model('Remark', remarks)