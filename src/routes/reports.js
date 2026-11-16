const router=require('express').Router(), multer=require('multer'), path=require('path'), fs=require('fs');
const Report=require('../models/Report'), auth=require('../middleware/auth');
const dir=path.join(__dirname,'../../uploads');fs.mkdirSync(dir,{recursive:true});
const storage=multer.diskStorage({destination:(req,file,cb)=>cb(null,dir),filename:(req,file,cb)=>cb(null,Date.now()+'-'+Math.round(Math.random()*1e9)+path.extname(file.originalname).toLowerCase())});
const upload=multer({storage,limits:{fileSize:5*1024*1024,files:5},fileFilter:(req,file,cb)=>cb(null,['image/jpeg','image/png','image/webp','image/gif'].includes(file.mimetype))});
router.get('/',auth,async(req,res,next)=>{try{
 const q={};if(req.query.type&&['lost','found'].includes(req.query.type))q.type=req.query.type;
 if(req.query.search)q.$or=['title','description','location'].map(k=>({[k]:{$regex:req.query.search,$options:'i'}}));
 const reports=await Report.find(q).populate('owner','name email').sort({createdAt:-1});res.json({reports});
}catch(e){next(e)}});
router.post('/',auth,upload.array('images',5),async(req,res,next)=>{try{
 const {type,title,category,description,date,location}=req.body;
 if(!req.files||!req.files.length)return res.status(400).json({message:'At least one item photo is required.'});
 if(!type||!title||!category||!description||!date||!location){req.files.forEach(f=>fs.unlinkSync(f.path));return res.status(400).json({message:'Complete all required fields.'});}
 const images=req.files.map(f=>'/uploads/'+f.filename);
 const report=await Report.create({type,title,category,description,date,location,storageLocation:req.body.storageLocation,serial:req.body.serial,reward:req.body.reward,contact:req.body.contact,images,owner:req.user._id,status:type==='found'?'Available':'Open'});
 res.status(201).json({message:'Report saved.',report});
}catch(e){next(e)}});
router.get('/mine',auth,async(req,res,next)=>{try{res.json({reports:await Report.find({owner:req.user._id}).sort({createdAt:-1})})}catch(e){next(e)}});
module.exports=router;
