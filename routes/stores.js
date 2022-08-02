const express=require('express');
const {getStores, addStore}=require('../controllers/stores');
const multer=require('multer');
const router=express.Router();


const storage=multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload=multer({storage:storage});


router.route('/').get(getStores).post(upload.single('image'), addStore);


router.get('/', (req, res)=>{
    res.send('Hello')
});
module.exports=router;
