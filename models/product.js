const fs = require('fs');
const path = require('path');

const filePath = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductFromFile = cb => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  })
}
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductFromFile(products=> {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products));
    })
  }

  static fetchAll(cb) {
    getProductFromFile(cb);
  }

}