import React, { useState, useEffect } from 'react';
import './Cart.css';
import { Link } from 'react-router-dom';
import { getCurrentUser} from 'aws-amplify/auth';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [checkedOutItems, setCheckedOutItems] = useState([]);
    const [userName, setUserName] = useState('');
    const [userPoints, setUserPoints] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const checkedOut = JSON.parse(localStorage.getItem('checkedOutItems')) || [];
        setCartItems(cart);
        setCheckedOutItems(checkedOut);
    }, []);

    console.log(userName);

    useEffect(() => {
        const fetchUserPoints = async () => {
          try {
            const response = await fetch('https://92fbb96j94.execute-api.us-east-1.amazonaws.com/dev/points', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userName: userName }), // Send the current user's username in the request body
            });
            const data = await response.json();
            if (data.length > 0) {
              setUserPoints(data[0].Points); // Update the state with the user's points
            }
          } catch (error) {
            console.error('Error fetching user points:', error);
          }
        };

        if (userName) {
          fetchUserPoints();
        }
      }, [userName]);

    useEffect(() => {
        const getUserName = async () => {
          try {
            // Your method to get the current user's name, adjust as necessary
            const attributes = await getCurrentUser(); 
            const username = attributes.username;
    
            setUserName(username);
          } catch (error) {
            console.error('Error fetching user name:', error);
          }
        };
        getUserName();
      }, []);

    const updateQuantity = (index, quantity) => {
        const newCart = [...cartItems];
        newCart[index].quantity = Math.max(1, quantity); // Ensure quantity is at least 1
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeFromCart = (index) => {
        const newCart = [...cartItems];
        newCart.splice(index, 1);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + (item.collectionPrice * item.quantity), 0).toFixed(2);
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
            <Link to="/catalog">Go to Catalog</Link>
            <section className="user-points">
                <h2>Your Points</h2>
                <p>{userPoints} points</p> {/* Display the user's points */}
            </section>
            <h2>Cart</h2>
            <div className="cart-items">
                {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <div className="cart-item-info">
                            <div>{item.trackName} by {item.artistName}</div>
                            <div><b>{item.collectionPrice*100} Points</b></div>
                        </div>
                        <div className="quantity-input">
                            <button onClick={() => updateQuantity(index, item.quantity + 1)}>▲</button>
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                            />
                            <button onClick={() => updateQuantity(index, item.quantity - 1)}>▼</button>
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
