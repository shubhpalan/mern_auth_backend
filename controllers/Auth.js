const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "KUYCnjcJAUC7973b98jKS";

const Validation = async (req,res,next)=>{
    if(!req.body.email || req.body.email ===''){
        return res.json({
            success: false,
            message:`Email is Required`
        })
    }
    if(!req.body.password || req.body.password ===''){
        return res.json({
            success: false,
            message:`Password is Required`
        })
    }
    next();
}

const login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email}).select('+password');
        // Check if User Exists
        if(!user){
            return res.json({
                success:false,
                message:`User with email ${email} not found`
            });
        }
        const passCheck = await bcrypt.compareSync(password,user.password);
        if(!passCheck){
            return res.json({
                success:true,
                message:"Incorrect Password"
            });
        }

        const token = jwt.sign({
            id:user._id,
        },JWT_SECRET,{
            expiresIn:"2hr"
        });
        res.cookie("user",token,{maxAge:1000*60*60/* 1 hr in millisecs*/, httpOnly:true});
        return res.json({
            success:true,
            message:"Login Succesful",
            user
        })
    }catch(err){
        console.log(err);
        res.json({
            success:false,
            message:"Login Failure please try again"
        })
    }
    
}

const signUp = async (req,res) =>{
    try{
        const checkUser = await User.findOne({email:req.body.email});
        if(checkUser){
            return res.json({
                success:false,
                message:"User with this email already exists"
            })
        }
        req.body.password = bcrypt.hashSync(req.body.password);
        
        const user = await User.create(req.body);
        const token = jwt.sign({
            id:user._id,
        },JWT_SECRET,{
            expiresIn:"2hr"
        });
        res.cookie("user",token,{maxAge:1000*60*60/* 1 hr in millisecs*/, httpOnly:true});
      
        return res.json({
            success:true,
            message:"Signup Succesful",
            user,
        })
    }catch(err){
        console.log(err);
        res.json({
            success: false,
            message: "Signup unsuccessful please try again"
        })
    }
}

const verifyJwt = (req,res,next) =>{
    const token = req.cookies.user;
    if(!token){
      return  res.status(401).json({
            success:false,
            message:"UnAuthorized Please Login"
        });
    }
    jwt.verify(String(token),JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(401).json({
                success:false,
                message:"Invalid Token Please Login again"
            });
        }
        req.userId = user.id
        next();

    })

}


const logout = async (req,res) =>{
    try{
        res.cookie("user","",{maxAge:1000*60*60/* 1 hr in millisecs*/, httpOnly:true});
        res.json({
            success:true,
            message:"User Logged Out"
        })
    }catch(err){
        console.log(err);
        res.json({
            success:false,
            message:"Logout Error"
        })
    }
}

module.exports = {
    signUp,
    login,
    Validation,
    verifyJwt,
    logout
}