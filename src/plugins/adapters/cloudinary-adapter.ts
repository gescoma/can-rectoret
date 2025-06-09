import type { HandleDelete, HandleUpload } from '@payloadcms/plugin-cloud-storage/types'

import type { UploadApiResponse } from 'cloudinary'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const cloudinaryUrl = cloudinary.url

const cloudinaryAdapter = () => ({
  name: 'cloudinary-adapter',
  async handleUpload({
    file,
  }: Parameters<HandleUpload>[0]) {
    try {
      // createing a function that will upload your file in cloudinary
      // Uploading the file to Cloudinary using upload_stream.
      // Since Cloudinary's upload_stream is callback-based, we wrap it in a Promise
      // so we can use async/await syntax for cleaner, easier handling.
      // It uploads the file with a specific public_id under "media/", without overwriting existing files.
      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto', // auto-detect file type (image, video, etc.)
            public_id: `media/${file.filename.replace(/\.[^/.]+$/, '')}`, // Set custom file name without extension, and it also previxed the cleaned filename with media/
            overwrite: false, // Do not overwrite if a file with the same name exists
            use_filename: true, // Use original filename
          },
          (error, result) => {
            if (error) return reject(error)
            if (!result) return reject(new Error('No result returned from Cloudinary'))
            resolve(result) // hanlde result
          },
        )
        uploadStream.end(file.buffer) // this line send the file to cloudinary it means entire file is already in memory and will be send whole thing at once not in chunk
      })
      file.filename = uploadResult.public_id // Use Cloudinary's public_id as the file's unique name
      file.mimeType = `${uploadResult.format}` // Set MIME type based on Cloudinary's format (e.g., image/png)
      file.filesize = uploadResult.bytes // Set the actual file size in bytes, for admin display and validations
    } catch (err) {
      console.error('Upload Error', err)
    }
  },

  async handleDelete({ filename }: Parameters<HandleDelete>[0]) {
    console.log('handleDelete has been called')

    // if filename is present then we will look for that file
    try {
      // We remove the file extension from the filename and then target the file
      // inside the "media/" folder on Cloudinary (which we used as the upload path)
      await cloudinary.uploader.destroy(`media/${filename.replace(/\.[^/.]+$/, '')}`)
    } catch (error) {
      // if something error occured we will catch the error and respond the error in console
      console.error('Cloudinary Delete Error:', error)
    }
  },
  staticHandler() {
    return new Response('Not implemented', { status: 501 })
  },
})

export { cloudinaryAdapter, cloudinaryUrl}