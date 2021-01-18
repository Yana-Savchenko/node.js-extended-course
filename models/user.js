const mongodb = require('mongodb');

const { getDb } = require('../helpers/database');

const ObjectId = mongodb.ObjectId;
class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    db.collection('users').insertOne(this)
      .then(user => {
        console.log(user);
      })
      .catch(err => {
        console.log(err);
      })
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(item => item.productId);

    return db.collection('products').find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(prod => {
          return {
            ...prod,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === prod._id.toString();
            }).quantity
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  addToCart(product) {
    const db = getDb();
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQty = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQty = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQty;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQty })
    }

    const uppdatedCart = { items: updatedCartItems };

    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: uppdatedCart } }
    );
  }

  deleteItemFromCart(productId) {
    const db = getDb();

    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: { items: updatedCartItems } } }
    );
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: ObjectId(userId) })
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      })
  }
}

module.exports = User;