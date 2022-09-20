const express=require('express');
const multer=require('multer');
// const path = require('path');
const adminController = require('../controllers/controller_stores');
const router=express.Router();
const isAuth = require('../middleware/is-auth');
const csrf = require('csurf');
const fetch = require('node-fetch');


// const isAuth=require('../middleware/is-auth');

// const store=require('../models/model_Store');
// const { route } = require('./auth');


const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    }
});

const upload=multer({storage:fileStorage}).single('image');

router.get ('/', adminController.getStores);
router.get('/add',isAuth, adminController.getAddStore);
router.get('/api-stores', adminController.getStores)
router.get('/stores-list', adminController.getStoresList)
router.get('/stores/:storeId', adminController.getStore);
router.get('/edit-store/:storeId',isAuth,upload, adminController.getEditStore);
router.post('/edit-store',isAuth, upload, adminController.postEditStore);


router.post('/add-store', isAuth, upload, adminController.addStore)
router.post('/delete-store', isAuth, adminController.deleteStore)



module.exports=router;