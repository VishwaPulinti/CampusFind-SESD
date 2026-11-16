const router=require('express').Router(), bcrypt=require('bcryptjs'), jwt=require('jsonwebtoken'), User=require('../models/User');
const token=u=>jwt.sign({userId:u._id},process.env.JWT_SECRET,{expiresIn:'7d'});
router.post('/register',async(req,res,next)=>{try{
 const {name,email,password}=req.body;if(!name||!email||!password)return res.status(400).json({message:'Enter name, email and password.'});
 if(password.length<6)return res.status(400).json({message:'Password must contain at least 6 characters.'});
 if(await User.findOne({email:email.toLowerCase()}))return res.status(409).json({message:'Email is already registered.'});
 const u=await User.create({name,email,password:await bcrypt.hash(password,12)});
 res.status(201).json({token:token(u),user:{id:u._id,name:u.name,email:u.email}});
}catch(e){next(e)}});
router.post('/login',async(req,res,next)=>{try{
 const u=await User.findOne({email:(req.body.email||'').toLowerCase()});
 if(!u||!(await bcrypt.compare(req.body.password||'',u.password)))return res.status(401).json({message:'Invalid email or password.'});
 res.json({token:token(u),user:{id:u._id,name:u.name,email:u.email}});
}catch(e){next(e)}});
module.exports=router;
