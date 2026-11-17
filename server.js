require('dotenv').config();
const express=require('express'),mongoose=require('mongoose'),path=require('path'),fs=require('fs');
const app=express(),port=process.env.PORT||5000;
if(!process.env.MONGODB_URI||!process.env.JWT_SECRET){console.error('Create .env from .env.example first.');process.exit(1);}
fs.mkdirSync(path.join(__dirname,'uploads'),{recursive:true});
app.use(express.json());app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(express.static(path.join(__dirname,'public')));
app.get('/api/health',(req,res)=>res.json({status:'ok'}));
app.use('/api/auth',require('./src/routes/auth'));
app.use('/api/reports',require('./src/routes/reports'));
app.use('/api/claims',require('./src/routes/claims'));
app.use('/api/admin',require('./src/routes/admin'));
app.use((err,req,res,next)=>{console.error(err);res.status(err.code==='LIMIT_FILE_SIZE'?400:500).json({message:err.code==='LIMIT_FILE_SIZE'?'Each image must be 5 MB or smaller.':err.message||'Server error'});});
mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(port,()=>console.log(`CampusFind running at http://localhost:${port}`))).catch(e=>{console.error('MongoDB connection failed:',e.message);process.exit(1)});
