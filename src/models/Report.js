const mongoose=require('mongoose');
const schema=new mongoose.Schema({
 type:{type:String,enum:['lost','found'],required:true},
 title:{type:String,required:true,trim:true,maxlength:120},
 category:{type:String,required:true}, description:{type:String,required:true,maxlength:1500},
 date:{type:Date,required:true}, location:{type:String,required:true},
 storageLocation:String, serial:String, reward:String, contact:String,
 images:{type:[String],validate:v=>v.length>0},
 status:{type:String,default:'Open'},
 owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
},{timestamps:true});
module.exports=mongoose.model('Report',schema);
