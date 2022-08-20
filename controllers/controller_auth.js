
const User = require('../models/model_User');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
    });
  };

  exports.postLogin = (req, res, next) => {
    const name = req.body.name;
    console.log(name);
    User.findOne({ name: name })
      .then(user => {
        if (!user) {
          return res.json({
            message: 'User not found'
            });
        } else {
        return res.json({
          message: 'User  found'
          });
        }

    
    })  
  };