const router=require('express').Router(), bcrypt=require('bcryptjs'), jwt=require('jsonwebtoken'), User=require('../models/User');
const token=u=>jwt.sign({userId:u._id},process.env.JWT_SECRET,{expiresIn:'7d'});
const isAdmin=email=>(process.env.ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());
const publicUser=u=>({id:u._id,name:u.name,email:u.email,role:u.role,department:u.department,status:u.status});
router.post('/register',async(req,res,next)=>{try{
 const {name,email,password}=req.body;if(!name||!email||!password)return res.status(400).json({message:'Enter name, email and password.'});
 if(password.length<6)return res.status(400).json({message:'Password must contain at least 6 characters.'});
 if(await User.findOne({email:email.toLowerCase()}))return res.status(409).json({message:'Email is already registered.'});
 const normalized=email.toLowerCase().trim();const u=await User.create({name,email:normalized,password:await bcrypt.hash(password,12),role:isAdmin(normalized)?'admin':'user'});
 res.status(201).json({token:token(u),user:publicUser(u)});
}catch(e){next(e)}});
router.post('/login',async(req,res,next)=>{try{
 const u=await User.findOne({email:(req.body.email||'').toLowerCase()});
 if(!u||!(await bcrypt.compare(req.body.password||'',u.password)))return res.status(401).json({message:'Invalid email or password.'});
 if(u.status==='suspended')return res.status(403).json({message:'Your account is suspended. Contact the campus administrator.'});
 if(isAdmin(u.email)&&u.role!=='admin'){u.role='admin';await u.save()}
 res.json({token:token(u),user:publicUser(u)});
}catch(e){next(e)}});
module.exports=router;
