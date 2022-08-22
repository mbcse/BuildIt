import multer from 'multer'
import { v4 as uuid } from 'uuid'
import path from 'path'

// Profile Upload Storage
const profileImageStorage = multer.diskStorage(
  {
    destination: './public/uploads/profileImages',
    filename: (req, file, cb) => {
      cb(null, 'userprofile' + '_' + uuid() + path.extname(file.originalname))
    }
  }
)

// Post Upload Storage
const eventPassStorage = multer.diskStorage(
  {
    destination: './public/uploads/eventpasses',
    filename: (req, file, cb) => {
      cb(null, 'eventpass' + '_' + uuid() + path.extname(file.originalname))
    }
  }
)

export const uploadProfile = multer({ storage: profileImageStorage })
export const uploadEventPass = multer({ storage: eventPassStorage })
