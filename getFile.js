const fs = require('fs');
const util = require('util')

console.log('here');
const getFile = fileName => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        console.log('error');
        reject(err); // calling `reject` will cause the promise to fail with or without the error passed as an argument
        return; // and we don't want to go any further
      }
      resolve(data);
    });
  });
};
console.log('there');
getFile('package.json')
  .then(data => console.log(data))
  .catch(err => console.error(err));

  