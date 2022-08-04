const Store=require('../models/Store')

// @desc Get all stores
// @route GET /api/v1/stores
// @access Public

exports.getStores = async (req, res, next)=>{
    try {
        const stores=await Store.find();
        return res.status(200).json({
            success:true,
            count:stores.length,
            data:stores
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Server error"})
    }
}

// @desc Create a store
// @route POST /api/v1/stores
// @access Public
exports.addStore= async (req, res, next)=>{
    try {
        console.log('here');
        console.log(req.body);
        const store=new Store({
            storeId:req.body.storeId,
            address:req.body.address,
            image:req.file.path
        })
        store
        .save()
        .then(()=>{
            res.status(201).json({
                success:true,
                message:"Store added successfully"
            })
        console.log(store);
        console.log(req.file);
        })
 
    } catch (err) {
        console.error(err);
        if (err.code===11000){
            return res.status(400).json({error:'this store already exist'})
        }
        res.status(500).json({error:"Server error"})
    }
}