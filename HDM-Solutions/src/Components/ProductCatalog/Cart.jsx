import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css'; // Import the CSS file for the Cart component

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [checkedOutItems, setCheckedOutItems] = useState([]);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const checkedOut = JSON.parse(localStorage.getItem('checkedOutItems')) || [];
        setCartItems(cart);
        setCheckedOutItems(checkedOut);
    }, []);

    const removeFromCart = (index) => {
        const newCart = [...cartItems];
        newCart.splice(index, 1);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.collectionPrice, 0).toFixed(2);
    };

    const checkout = () => {
        // Add the checked out items to the checkedOutItems state and localStorage
        const newCheckedOutItems = [...checkedOutItems, ...cartItems];
        setCheckedOutItems(newCheckedOutItems);
        localStorage.setItem('checkedOutItems', JSON.stringify(newCheckedOutItems));

        // Clear the cart and update localStorage
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    return (
        <div className="cart">
            <Link to="/catalog">Back to Product Catalog</Link>
            <h2>Cart</h2>
            <div className="cart-items">
                {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <div className="cart-item-info">
                            <div>{item.trackName} by {item.artistName}</div>
                            <div>{item.collectionPrice * 100} Points</div>
                        </div>
                        <button className="remove-btn" onClick={() => removeFromCart(index)}>Remove</button>
                    </div>
                ))}
            </div>
            <div className="cart-total">
                Total: {calculateTotal(cartItems) * 100} Points
            </div>
            <button className="checkout-btn" onClick={checkout}>Checkout</button>
            <h2>Purchased Items</h2>
            <div className="checked-out-items">
                {checkedOutItems.map((item, index) => (
                    <div key={index} className="checked-out-item">
                        <div>{item.trackName} by {item.artistName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cart;
