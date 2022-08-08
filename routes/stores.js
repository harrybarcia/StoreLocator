const express=require('express');
const {getStores, addStore}=require('../controllers/controller_stores');
const multer=require('multer');
const router=express.Router();


const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, './public/uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    }
});

const upload=multer({storage:fileStorage}).single('image');



router.route('/').get(getStores)
router.route('/').post(upload, addStore)


router.get('/', (req, res)=>{
    res.send('Hello')
});
module.exports=router;
