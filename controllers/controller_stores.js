const Store=require('../models/model_Store')
const mongodb=require('mongodb');
const getDb=require('../config/db').getDb;

// @desc Get all stores
// @route GET /api/v1/stores
// @access Public

exports.getStores=(req,res,next)=>{
    try {
     console.log('get');
        const db=getDb();
        db.collection('stores').find()
        .toArray()
        .then(stores=>{
            res.status(200).json({
                success:true,
                count:stores.length,
                data:stores
            })
        }
        )
    }
    catch (err) {
        console.error(err);
        res.status(500).json({error:"Server error"})
    }
}
// @desc Create a store
// @route POST /api/v1/stores
// @access Public
exports.addStore=  (req, res, next)=>{
    console.log('post');

    try {
        const store=new Store(req.body);

        const db=getDb(); 
        let dbOp;  
        dbOp=db.collection('stores').insertOne(this);
        return dbOp;

    } catch (err) {
        console.error(err);
        if (err.code===11000){
            return res.status(400).json({error:'this store already exist'})
        }
        res.status(500).json({error:"Server error"})
    }
}