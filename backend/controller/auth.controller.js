import User from "../models/user.model.js";
import jwt from "jsonwebtoken"


const generateToken = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: "15m" }
    )
    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: "7d" }
    )
    return { accessToken, refreshToken }
}

const setCookies=(res,accessToken,refreshToken)=>{
    res.cookie("access_token",accessToken,{
        httpOnly:true, //prevent XSSS attacks , cross site scripting attacks
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",  //prevent CSRF attcacks,Cross site request forgery
        maxAge:15*60*1000 //15 in minutes
    }) 
    res.cookie("refresh_token",refreshToken,{
        httpOnly:true, //prevent XSSS attacks , cross site scripting attacks
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",  //prevent CSRF attcacks,Cross site request forgery
        maxAge:7*24*60*60*1000 //7 in days
    })   
}



export const signup = async (req,res)=>{

    const{username, name, email, phone, password}=req.body
    try{
        const userExist=await User.findOne({email})
        if(userExist){
            return res.status(400).json({message:"User already exist"})
        }
        const usernameExist=await User.findOne({username})
        if(usernameExist){
            return res.status(400).json({message:"Username already exist"})
        }
        const user=await User.create({username, name, email, phone, password})

        const {accessToken,refreshToken}=generateToken(user._id)
        setCookies(res,accessToken,refreshToken)

        res.status(201).json({user:{
            _id:user._id,
            username:user.username,
            name:user.name,
            email:user.email,
            phone:user.phone,
            role:user.role
        }, message:" created successfully"})
    }
    catch(err){
        console.log("Error in signup",err)
        res.status(500).json({message:err.message})
    }   
}


export const login = async (req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(user && (await user.comparePassword(password))){
            const {accessToken,refreshToken}=generateToken(user._id)
            setCookies(res,accessToken,refreshToken)
            res.status(200).json({user:{
                _id:user._id,
                username:user.username,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role
            }})
        }
        else{
            return res.status(400).json({message:"Invalid email or password"})
        }
    }
    catch(err){
        console.log("Error in login",err);
        res.status(500).json({message:err.message})
    }
}


export const logout = async (req,res)=>{
    try{
        const refreshToken=req.cookies.refresh_token
        if(refreshToken){
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY)

        }
        res.clearCookie("access_token")
        res.clearCookie("refresh_token")
        res.status(200).json({message:"Logged out successfully"})
    }
    catch(err){
        console.log("Error in logout",err);
        res.status(500).json({message:"Server Error",error:err.message})
    }
}


export const refreshToken = async (req,res)=>{
    try{
        const refreshToken=req.cookies.refresh_token
        if(!refreshToken){
            return res.status(401).json({message:"No refresh token provided"})
        }
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY)
        const accessToken=jwt.sign({userId:decoded.userId},process.env.ACCESS_TOKEN_KEY,{expiresIn:"15m"})
        res.cookie("access_token",accessToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
            maxAge:15*60*1000,
        })
        res.json({message:"Token refreshed successfully"})
    }
    catch(err){
        console.log("Error in refresh token",err);
        res.status(500).json({message:"Server Error",error:err.message})
    }
}


export const getProfile = async (req,res)=>{
    try{
        res.json({
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        })
    }
    catch(err){
        console.log("Error in get profile",err);
        res.status(500).json({message:"Server Error",error:err.message})
    }
}