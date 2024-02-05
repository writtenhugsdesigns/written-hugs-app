const multer = require('multer')
const { google } = require('googleapis')
const apikeys = require('../../googleDriveAPI.json')
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const MulterGoogleCloudStorage = require('multer-cloud-storage');

const googleCloudFolderReference = {
    destination: '1wG6GeFUgvvh-8GOHw1NhlfRPUUDfP2H_', 
}

const multerGoogleCloudStorageSettings = {
    
}