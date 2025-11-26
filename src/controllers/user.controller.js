import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";

const registerUser = asyncHandler(async(req,res)=>{
    // get user details from frontend 
    // validation - not empty
    // check if user already exists: username , email
    // check for images , check for avatar
    // upload them to cloudinary , avatar
    // create user in object - create entry in db
    // remove password and refreshtoken field from response
    // check for user creation  
    // return res

    const {fullname , email , username , password} = req.body
    console.log("BODY RECEIVED:", req.body);
    if(fullname === ""){
        throw new ApiError(400, 'Full name is required');
    }
    if(email === ""){
        throw new ApiError(400, 'Email name is required');
    }
    if(username === ""){
        throw new ApiError(400, 'Username name is required');
    }   
    if(password === ""){
        throw new ApiError(400, 'Password name is required');
    }
    // check if user already exists or not
    const userExists = user.findOne({
        $or : [{username},{email}]
    })
    if(userExists){
        throw new ApiError(409, 'User already exists');
    }
    // upload avater and coverimage
    const avatarLocalpath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;     
    if(!avatarLocalpath){
        throw new ApiError(400, 'Avater is required');
    }
    // upload all things in cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalpath);
    const coverImage = await uploadOnCloudinary(coverImageLocalpath);
    // again check
    if(!avatarLocalpath){
        throw new ApiError(400, 'Avater is required');
    }
    // upload all to the database
    user.create({
        fullname,
        avatar : avatar.url,
        // ? as coverImage is not mandetory
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()

    })   
    // check database created or not and remove passoword and refreshToken from the database
    const createdUser = await user.findById(user._id).select(
        "-password -refreshToken"
    )     
    if(!createdUser){
        throw new ApiError(500, 'Something weent wrong while registering the user');
    }
    return res.status(201).json(
        new apiResponce(200,createdUser,"User registered successfully")
    )
})

export default registerUser;