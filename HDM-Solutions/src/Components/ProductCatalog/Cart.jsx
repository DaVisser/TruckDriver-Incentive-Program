import React, { useState, useEffect } from 'react';
import './Cart.css';
import { Link } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [checkedOutItems, setCheckedOutItems] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const checkedOut = JSON.parse(localStorage.getItem('checkedOutItems')) || [];
        setCartItems(cart);
        setCheckedOutItems(checkedOut);
    }, []);

    useEffect(() => {
        const getUserName = async () => {
            try {
                const user = await getCurrentUser();
                const username = user.username;
                setUserName(username);
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
        getUserName();
    }, []);

    const fetchUserPoints = async () => {
        try {
            const userSession = await getCurrentUser();
            const userId = userSession.userId;
            const response = await fetch(`https://7u2pt3y8zd.execute-api.us-east-1.amazonaws.com/prod/UserInfo`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userId}`,
                },
            });
            const data = await response.json();
            if (data && data.length > 0 && data[0].Points) {
                setUserPoints(data[0].Points);
            } else {
                console.error('No points data available:', data);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        fetchUserPoints();
    }, []);

    const updateQuantity = (index, quantity) => {
        const newCart = [...cartItems];
        newCart[index].quantity = Math.max(1, quantity);
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

    const checkout = async () => {
        const totalPoints = calculateTotal(cartItems) * 100;
        if (userPoints >= totalPoints) {
            try {
                const response = await fetch('https://92fbb96j94.execute-api.us-east-1.amazonaws.com/dev/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: userName, pointsToDeduct: totalPoints })
                });
                const result = await response.json();
                if (response.ok) {
                    console.log('Checkout successful, points left:', result.newPoints);
                    setUserPoints(result.newPoints);
                    setCheckedOutItems([...checkedOutItems, ...cartItems]);
                    localStorage.setItem('checkedOutItems', JSON.stringify([...checkedOutItems, ...cartItems]));
                    setCartItems([]);
                    localStorage.removeItem('cart');
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Failed to checkout:', error);
                alert('Failed to process checkout.');
            }
        } else {
            alert('Insufficient points');
        }
    };

    return (
        <div className="cart">
            <Link to="/catalog">Go to Catalog</Link>
            <section className="user-points">
                <h2>{userName}, your points:</h2>
                <p>{userPoints} points</p>
            </section>
            <h2>Cart</h2>
            <div className="cart-items">
                {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <div className="cart-item-info">
                            <div>{item.trackName} by {item.artistName}</div>
                            <div><b>{item.collectionPrice * 100} Points</b></div>
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
