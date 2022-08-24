const Store=require('../models/model_Store')
const mongodb=require('mongodb');
// @desc Get all stores
// @route GET /api-stores
// @access Public

exports.getStores = (req, res, next) => {
  
  Store.find({ userId: req.user._id })
    .then(stores => {
      console.log(stores);
      return res.status(200).json(stores);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getStoresList = (req, res, next) => {
  Store.find({ userId: req.user._id })
    .then(stores => {
      console.log(stores);
      res.render('stores/stores-list', {
        prods: stores,
        pageTitle: 'All stores',
        path: '/stores-list',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getStore = (req, res, next) => {
  console.log('heree');
  console.log(req.params);
  const storeId = (req.params.storeId).trim();
  console.log(storeId)
  Store.findById(storeId)
    .then(store => {
      console.log(store);
      res.render('stores/store-details', {
        prods: store,
        path: '/stores/:storeId',
      });
    })
    .catch(err => console.log(err));
};

  exports.getAddStore= (req, res, next)=>{
    console.log("add store", req.user);
      res.render('pages/add',{
          path:'/add-store',
          pageTitle:'Add Store',
          editing:false
      })
      }
// @desc Create a store
// @route POST /api-stores
// @access Public
exports.addStore=async  (req, res, next)=>{
  console.log('session addstores', req.headers['csrf-token']);
  const address=req.body.address;
  const image = req.file.filename;
  const storeId = new mongodb.ObjectId();
  const userId = req.user._id;

        const store=await new Store({
          storeId:storeId,
          address: address, image:image, userId:userId});
        store
        .save()
        .then(results => {
          console.log('results');
          console.log(results);
          res.render('pages/index', {
            pageTitle: 'Store Locator | Home',
            path: '/' ,
          csrfToken:req.csrfToken(),

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


exports.getEditStore = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const storeId = req.params.storeId;
  Store.findById(storeId)
    .then(store => {
      if (!store) {
        return res.redirect('/');
      }
      res.render('pages/add',{
        path:'/add',
        pageTitle:'Add Store',
        editing: editMode,
        store: store,
        csrfToken:req.csrfToken()      

      });
    })
    .catch(err => console.log(err));
};

exports.postEditStore = (req, res, next) => {
  const storeId = req.body.storeId;
  const updatedAddress = req.body.address;
  const updatedImage = req.file.filename;


  Store.findById(storeId)
    .then(store => {
      // if (store.userId.toString() !== req.user._id.toString()) {
      //   return res.redirect('/');
      // }
      store.address = updatedAddress;
      store.image = updatedImage;
      return store.save()
    .then(result => {
      console.log('UPDATED PRODUCT!');
      // res.redirect('/stores/' + storeId);
      res.redirect('/');
    });
  })
    .catch(err => console.log(err));
};

exports.deleteStore = (req, res, next) => {
  const storeId = req.body.storeId;
  Store.deleteOne({ _id: storeId })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/stores-list');
    })
    .catch(err => console.log(err));
};