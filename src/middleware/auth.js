const jwt=require('jsonwebtoken'); const User=require('../models/User');
module.exports=async(req,res,next)=>{try{
 const h=req.headers.authorization||''; const token=h.startsWith('Bearer ')?h.slice(7):null;
 if(!token)return res.status(401).json({message:'Please log in.'});
 const p=jwt.verify(token,process.env.JWT_SECRET); const user=await User.findById(p.userId).select('-password');
 if(!user)return res.status(401).json({message:'Account not found.'}); if(user.status==='suspended')return res.status(403).json({message:'Account suspended.'}); req.user=user; next();
}catch(e){res.status(401).json({message:'Session expired. Please log in again.'});}};
