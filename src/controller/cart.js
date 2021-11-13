const Cart = require('../models/cart');

exports.addItemToCart = (req, res) => {

    Cart.findOne({ user: req.user._id })
        .exec((error, cart) => {
            if (error) {
                return res.status(400).json({ error });
            }
            if (cart) {
                // if cart is already exist then update cart by quantity
                const product = req.body.cartItem.product;
                const item = cart.cartItem.find(c => c.product == product)
                let condition, update;

                if (item) {
                    // kung item nga iyang gipili is parehas sa current of product_id
                    condition = { "user": req.user._id, "cartItem.product": product };
                    update = {
                        "$set": {
                            "cartItem.$": {
                                ...req.body.cartItem,
                                quantity: item.quantity + req.body.cartItem.quantity
                            }
                        }
                    };
                } else {
                    // or else if ang item dili parehas sa product_id so mag create ug  another object sa sulod sa cart
                    condition = { user: req.user._id };
                    update = {
                        "$push": {
                            "cartItem": req.body.cartItem
                        }
                    };
                }
                Cart.findOneAndUpdate(condition, update)
                    .exec((error, cart) => {
                        if (error) return res.status(400).json({ error });
                        if (cart) {
                            return res.status(200).json({ cart: cart });
                        }
                    })
            } else {
                // if cart is not exist then create a new cart
                const cart = new Cart({
                    user: req.user._id,
                    cartItem: [req.body.cartItem]
                });

                cart.save((error, cart) => {
                    if (error) {
                        return res.status(400).json({ error });
                    }
                    if (cart) {
                        return res.status(200).json({ cart });
                    }
                });
            }
        })

}