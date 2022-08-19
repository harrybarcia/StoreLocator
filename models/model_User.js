const getDb = require('../config/db').getDb;
const mongodb=require('mongodb');


class User {
    constructor(name) {
        this.name = name;
    }


saveUser(){
    const db=getDb();
    return db.collection('users').insertOne(this);

}

static findById(userId){
    console.log('userId',userId);
    const db=getDb();
    return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)})

}
}
module.exports=User;