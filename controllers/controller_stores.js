const Store=require('../models/model_Store')

// @desc Get all stores
// @route GET /api-stores
// @access Public

exports.getStores = (req, res, next) => {
  Store.find()
    .then(stores => {
      console.log(stores);
      return res.status(200).json(stores);
    })
    .catch(err => {
      console.log(err);
    });
};

  exports.getAddStore= (req, res, next)=>{

      res.render('pages/add',{
          path:'/add-store',
          pageTitle:'Add Store'
      })
      }
// @desc Create a store
// @route POST /api-stores
// @access Public
exports.addStore=async  (req, res, next)=>{
  console.log('session addstores', req.headers['csrf-token']);
  const storeId=req.body.storeId;
  const address=req.body.address;
  const image=req.file.filename;
        const store=await new Store({
          storeId:storeId, address: address, image:image});
        store
        .save()
        .then(results => {
          console.log(results);
          res.render('pages/index', {
            pageTitle: 'Store Locator | Home',
            path: '/' ,
          csrfToken:req.csrfToken()      
        })
        })
          .catch (err=>{
            console.error(err);
            if (err.code===11000){
                return res.status(400).json({error:'this store already exist'})
            }
            res.status(500).json({error:"Server error"})
    })
}

