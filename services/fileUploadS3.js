import multer from 'multer'
import multerS3 from 'multer-s3'
import { S3Client } from '@aws-sdk/client-s3'
import config from '../config'
import { v4 as uuid } from 'uuid'
import path from 'path'

const s3 = new S3Client({
  accessKeyId: config.AWS.ACCESS_KEY_ID,
  secretAccessKey: config.AWS.ACCESS_KEY_SECRET,
  region: 'ap-south-1'
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// Profile Upload Storage
const profileUploadStorage = multerS3({
  s3,
  acl: 'public-read',
  bucket: 'mbcse-website-data',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: (req, file, cb) => {
    cb(null, 'profile/mbcse_profile' + '_' + uuid() + path.extname(file.originalname))
  }
})

// Post Upload Storage
const postUploadStorage = multerS3({
  s3,
  acl: 'public-read',
  bucket: 'mbcse-website-data',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: (req, file, cb) => {
    cb(null, 'posts/mbcse_post' + '_' + uuid() + path.extname(file.originalname))
  }
})

// Resume Upload Storage
const resumeUploadStorage = multerS3({
  s3,
  acl: 'public-read',
  bucket: 'mbcse-website-data',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: (req, file, cb) => {
    cb(null, 'resume/Mohit_Bhat_Resume' + path.extname(file.originalname))
  }
})

// Certificate Upload Storage
const certificateUploadStorage = multerS3({
  s3,
  acl: 'public-read',
  bucket: 'mbcse-website-data',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: (req, file, cb) => {
    cb(null, 'certificates/mbcse_certificates' + '_' + uuid() + path.extname(file.originalname))
  }
})

//* ***************** */

export const uploadProfile = multer({ storage: profileUploadStorage, fileFilter, limits: { fileSize: 1024 * 1024 * 20 } }) // we are allowing only 20 MB files
export const uploadPost = multer({ storage: postUploadStorage, fileFilter, limits: { fileSize: 1024 * 1024 * 20 } }) // we are allowing only 20 MB files
export const uploadResume = multer({ storage: resumeUploadStorage, fileFilter, limits: { fileSize: 1024 * 1024 * 20 } }) // we are allowing only 20 MB files
export const uploadCertificate = multer({ storage: certificateUploadStorage, fileFilter, limits: { fileSize: 1024 * 1024 * 20 } }) // we are allowing only 20 MB files
