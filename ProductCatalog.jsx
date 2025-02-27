import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductForm() {
    const [productName, setProductName] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [price, setPrice] = useState('');
    const [sponsorName, setSponsorName] = useState('');
    const [showForm, setShowForm] = useState(false); // State to control the visibility of the form
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8081/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/insertProduct', {
                productName,
                thumbnail,
                price,
                sponsorName
            });
            alert('Product inserted successfully');
            // Reset form fields after successful submission
            setProductName('');
            setThumbnail('');
            setPrice('');
            setSponsorName('');
            setShowForm(false); // Hide the form after successful submission
            // Fetch updated products after insertion
            fetchProducts();
        } catch (error) {
            console.error('Error inserting product:', error);
            alert('Error inserting product');
        }
    };

    const handleButtonClick = () => {
        setShowForm(true); // Show the form when the button is clicked
    };

    return (
        <div>
            <button onClick={handleButtonClick} style={buttonStyle}>Add Product</button>
            {showForm && (
                <div className="popup" style={popupStyle}>
                    <button className="close-btn" onClick={() => setShowForm(false)} style={closeButtonStyle}>Close</button>
                    <form onSubmit={handleSubmit}>
                        <label style={labelStyle}>
                            Product Name:
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </label>
                        <br />
                        <label style={labelStyle}>
                            Thumbnail URL:
                            <input
                                type="text"
                                value={thumbnail}
                                onChange={(e) => setThumbnail(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </label>
                        <br />
                        <label style={labelStyle}>
                            Price:
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </label>
                        <br />
                        <label style={labelStyle}>
                            Sponsor Name:
                            <input
                                type="text"
                                value={sponsorName}
                                onChange={(e) => setSponsorName(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </label>
                        <br />
                        <button type="submit" style={submitButtonStyle}>Submit</button>
                    </form>
                </div>
            )}
            <div>
                <h2>Inserted Products</h2>
                <ul>
                    {products.map((product, index) => (
                        <li key={index}>{product.productName} - ${product.price}</li>
                    ))}
                </ul>
            </div>
            {/* Integrate PointsToDollarsGrid component */}
            <PointsToDollarsGrid />
        </div>
    );
}

// Points to Dollars Ratio Grid Component
function PointsToDollarsGrid() {
    return (
        <div>
            <h2>Points to Dollars Ratio</h2>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={headerStyle}>Points</th>
                        <th style={headerStyle}>Dollars</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={dataStyle}>1</td>
                        <td style={dataStyle}>$0.01</td>
                    </tr>
                    <tr>
                        <td style={dataStyle}>10</td>
                        <td style={dataStyle}>$0.10</td>
                    </tr>
                    <tr>
                        <td style={dataStyle}>100</td>
                        <td style={dataStyle}>$1.00</td>
                    </tr>
                    {/* Add more rows as needed */}
                </tbody>
            </table>
        </div>
    );
}

// Styles
const buttonStyle = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
};

const popupStyle = {
    position: 'fixed',
    width: '50%',
    left: '25%',
    top: '25%',
    background: '#f9f9f9',
    border: '1px solid #888',
    zIndex: '1000',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
};

const labelStyle = {
    fontSize: '16px',
    margin: '8px 0',
};

const inputStyle = {
    width: '100%',
    padding: '12px 20px',
    margin: '8px 0',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
};

const submitButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '14px 20px',
    margin: '8px 0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
};

const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
};

const headerStyle = {
    textAlign: 'left',
};

const dataStyle = {
    textAlign: 'left',
};

export default ProductForm;
