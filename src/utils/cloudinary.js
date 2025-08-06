import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs"

 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLODINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });


    const uploadOnCloudinary = async (localFilePath) =>{
        try {

            if(!localFilePath) return null

                const response= await cloudinary.uploader.upload(
                    localFilePath, {
                    resource_type: "auto"
            })

            // file has been uploaded successfully 
                console.log("File is Uploaded on cloudinary", 
                response.url);

                fs.unlinkSync(localFilePath)

            return response 
            
        } catch (error) {
            fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
            return null
        }
    }

export {uploadOnCloudinary}

