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
    address:{
        type:String,
        required:[true, 'Please add an address']
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
        formattedAddress:String
      },
      createdAt:{
          type:Date,
          default:Date.now
      },
      image:{
        name: String,
        desc: String,
        img:
        {
            data: Buffer,
            contentType: String
        }
      }

    });

// Geocode & create locat
// we awnt to save before it is sent to the db
StoreSchema.pre('save', async function(next) {
  const   loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };
  // Do not save address
  this.address=undefined;
  next(); 
})
module.exports=mongoose.model('Store', StoreSchema)