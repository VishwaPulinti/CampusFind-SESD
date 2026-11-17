const mongoose=require('mongoose');
module.exports=mongoose.model('Announcement',new mongoose.Schema({title:{type:String,required:true},message:{type:String,required:true},createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},createdAt:{type:Date,default:Date.now}}));
