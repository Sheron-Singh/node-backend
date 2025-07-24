import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async(req, res) =>{
   // get user detailsfrom frontend
   // validation - not empty
   // check if user already exists: username, email
   // check for image, check for avatar
   // upload them to cloudinary, avatar
   // create user object = crete entry in db
   // remove password and referesh token from response
   // check for user creation
   // return res

   const {username, email, fullname, password}= req.body
   console.log("email:", email);
   
   if([fullname, email, username, password].some((field)=>
   field?.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }

   const existedUser = User.findOne({
      $or: [{ username }, { email }]
   })

   if(existedUser) {
      throw new ApiError(409, "User with email or username already exists ")
   }

   // Multer provide files property
   const avatarLocalpath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if (!avatarLocalpath) {
      throw new ApiError(400, "Avatar file is required");
   }

   const avatar = await uploadOnCloudinary(avatarLocalpath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
   }

   const user = User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if (!createdUser) {
      throw new ApiError(500, "Something went wron while registering user")

   }


   return res.status(201).json(
      new ApiResponse(200, createdUser, "User register successfully")
   )

})



export { registerUser } 