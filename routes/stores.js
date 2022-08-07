const express=require('express');
const {getStores, addStore}=require('../controllers/stores');

const router=express.Router();

router.route('/').get(getStores).post(addStore)


router.get('/', (req, res)=>{
    res.send('Hello')
});
module.exports=router;
