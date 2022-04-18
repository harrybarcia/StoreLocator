const mongoose=require('mongoose');
const geocoder=require('../utils/geocoder');

const StoreSchema=new mongoose.Schema({
    storeId:{
        type:String,
        require:[true, 'Please add a store ID'],
        unique:true,
        trim:true,
        maxlength:[10, 'Store ID must be less than 10 chars']
    },
    adress:{
        type:String,
        required:[true, 'Please add an adress']
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
          type: [Number],
          index:'2dsphere' //2dsphere support queries that calculates geometries on an earth like sphere

        },
        formattedAdress:String
      },
      createdAt:{
          type:Date,
          default:Date.now
      }
});
StoreSchema.pre('save', async function(next){
  const loc=await geocoder.geocode(this.adress);
  console.log(loc);
})
module.exports=mongoose.model('Store', StoreSchema)