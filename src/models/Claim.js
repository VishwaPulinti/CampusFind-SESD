const mongoose=require('mongoose');
const schema=new mongoose.Schema({item:{type:mongoose.Schema.Types.ObjectId,ref:'Report',required:true},claimant:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},description:{type:String,required:true,maxlength:1500},proofFiles:[String],status:{type:String,enum:['Pending','Approved','Rejected'],default:'Pending'},adminNotes:{type:String,default:''},riskScore:{type:Number,default:0}},{timestamps:true});
schema.index({item:1,claimant:1},{unique:true});module.exports=mongoose.model('Claim',schema);
