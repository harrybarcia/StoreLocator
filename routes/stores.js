const express=require('express');
const multer=require('multer');

const adminController = require('../controllers/controller_stores');
const router=express.Router();

const store=require('../models/model_Store');


const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    }
});

const upload=multer({storage:fileStorage}).single('image');



router.route('/').post(upload, adminController.addStore)
router.route('/').get(adminController.getStores)


module.exports=router;