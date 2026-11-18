const mongoose=require('mongoose');
module.exports=mongoose.model('Setting',new mongoose.Schema({kind:{type:String,enum:['category','location'],required:true},name:{type:String,required:true,trim:true,unique:true}},{timestamps:true}));
