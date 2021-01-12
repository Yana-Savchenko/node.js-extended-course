const fs = require('fs');
const path = require('path');

const filePath = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {

  static addProduct(id, price) {
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = ++updatedProduct.qty;
        cart.products[existingProductIndex] = updatedProduct;
        console.log(cart);
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      })
    })
  }

  static getCart(cb) {
    fs.readFile(filePath, (err, fileContent) => {
      if (!err) {
        const cart = JSON.parse(fileContent);
        return cb(cart);
      }
      return cb(null);
    })
  }

  static deleteProduct(id, price) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find(prod => prod.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;

      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - price * productQty;
      fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      })
    })
  }
}