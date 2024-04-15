import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductCatalog.css';
import { Grid, Header, Segment, Button, Form, Message, Image } from 'semantic-ui-react';
import { signOut, getCurrentUser, fetchUserAttributes} from 'aws-amplify/auth';

function ProductCatalog() {
    const [displaySection, setDisplaySection] = useState('songs');
    const [artistSongs, setArtistSongs] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState('');
    const [userRole, setUserRole] = useState('');
    const [newPoints, setNewPoints] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editSong, setEditSong] = useState(Object);
    const [sortOrder, setSortOrder] = useState('newest'); // State to track sorting order
    const [priceOrder, setPriceOrder] = useState('lowest'); // State to track price sorting order

    const artistIds = {
        'All Artists': '',
        'Drake': 271256,
        'Future': 128050210,
        '21 Savage': 894820464,
        'Lil Baby': 1276656483,
        'Gunna': 1236267297
    };

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const userAttr = await fetchUserAttributes();
                setUserRole(userAttr['custom:Role']); // Assuming the API response has a 'role' field
            } catch (error) {
                console.error('Error checking user role:', error);
            }
        };
        checkUserRole();
    }, []);

    useEffect(() => {
        const fetchSongsForArtist = async (artistId) => {
            try {
                const response = await axios.get(`https://itunes.apple.com/lookup?id=${artistId}&entity=song&limit=5`);
                return response.data.results.filter(result => result.wrapperType === 'track');
            } catch (error) {
                console.error(`Error fetching songs for artist ${artistId}:`, error);
                return [];
            }
        };

        const fetchAllSongs = async () => {
            const allSongs = [];
            for (const artistId of Object.values(artistIds)) {
                if (artistId) {
                    const songs = await fetchSongsForArtist(artistId);
                    allSongs.push(...songs);
                }
            }
            setArtistSongs(allSongs);
            localStorage.setItem('catalog', JSON.stringify(allSongs)); // Store catalog in localStorage
        };

        // Check if catalog exists in localStorage, if not, fetch it
        const storedCatalog = JSON.parse(localStorage.getItem('catalog'));
        if (storedCatalog && storedCatalog.length > 0) {
            setArtistSongs(storedCatalog);
        } else {
            fetchAllSongs();
        }
    }, []);

    const resetCatalog = () => {
        const storedCatalog = JSON.parse(localStorage.getItem('catalog'));
        setArtistSongs(storedCatalog || []); // Reset catalog to its original state
    };

    const deleteFromCatalog = (index) => {
        const updatedCatalog = [...artistSongs];
        updatedCatalog.splice(index, 1);
        setArtistSongs(updatedCatalog);
        localStorage.setItem('catalog', JSON.stringify(updatedCatalog)); // Update catalog in localStorage
    };

    const addToCart = (song) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(item => item.trackId === song.trackId);

        if (index > -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({ ...song, quantity: 1 }); // Set quantity to 1 for new items
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const applyDiscount = (index) => {
        const updatedCatalog = [...artistSongs];
        updatedCatalog[index].discounted = true;
        setArtistSongs(updatedCatalog);
        localStorage.setItem('catalog', JSON.stringify(updatedCatalog)); // Update catalog in localStorage
    };

    const modifyPoints = (song) => {
        setEditSong(song);
        setDisplaySection('ModifyPoints')
    };

    const validatePointsInput = (input) => {
        const isNumeric = /^[0-9]+$/.test(input); // Check if input is numeric
        const isValidLength = input.length <= 10; // Check if input does not exceed 10 digits
        const isNotEmpty = input.trim() !== ''; // Check if input is not empty

        if (!isNotEmpty) {
            return "Point value cannot be empty.";
        }
        if (!isNumeric) {
            return "Point value must be a numeric value.";
        }
        if (!isValidLength) {
            return "Point value cannot exceed 10 digits.";
        }

        return ""; // Return an empty string if all validations pass
    };

    const handleSubmit = () => {
        const validationMessage = validatePointsInput(newPoints);

        if (validationMessage !== "") {
            setErrorMessage(validationMessage); // Set the validation message as the error message
            return; // Prevent form submission if validation fails
        }

        // Proceed with updating points if validation passes
        updatePoints();
    };

    const updatePoints = () => {
        const updatedCatalog = artistSongs.map(song => {
            if (song.trackId === editSong.trackId) {
                return { ...song, collectionPrice: newPoints / 100 }; // Assuming 1 point = $0.01
            }
            return song;
        });
        setArtistSongs(updatedCatalog);
        localStorage.setItem('catalog', JSON.stringify(updatedCatalog)); // Update catalog in localStorage
        setDisplaySection('songs'); // Go back to the songs display
        clearMessages();
        setNewPoints('');
    };

    const editProductName = (index, newName) => {
        const updatedCatalog = [...artistSongs];
        updatedCatalog[index].trackName = newName;
        setArtistSongs(updatedCatalog);
        localStorage.setItem('catalog', JSON.stringify(updatedCatalog)); // Update catalog in localStorage
    };

    const clearMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handlePriceSortChange = (e) => {
        setPriceOrder(e.target.value);
    };

    const back = () =>{
        clearMessages();
        setDisplaySection('songs');
    };

    // Sort the songs based on the selected sorting order
    const sortedSongs = [...artistSongs].sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.releaseDate) - new Date(a.releaseDate);
        } else {
            return new Date(a.releaseDate) - new Date(b.releaseDate);
        }
    });

    // Sort the songs based on the selected price sorting order
    const sortedSongsByPrice = [...sortedSongs].sort((a, b) => {
        if (priceOrder === 'lowest') {
            return a.collectionPrice - b.collectionPrice;
        } else {
            return b.collectionPrice - a.collectionPrice;
        }
    });

    return (
        <div>
            <Link to="/cart">Go to Cart</Link>
            <div className="filter-options">
                <div className="filter-option">
                    <label>Filter by Artist: </label>
                    <select value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)}>
                        {Object.keys(artistIds).map(artist => (
                            <option key={artist} value={artist}>{artist}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-option">
                    <label>Filter by Age:</label>
                    <select value={sortOrder} onChange={handleSortChange}>
                        <option value="newest">Newest to Oldest</option>
                        <option value="oldest">Oldest to Newest</option>
                    </select>
                </div>
                <div className="filter-option">
                    <label>Filter by Price:</label>
                    <select value={priceOrder} onChange={handlePriceSortChange}>
                        <option value="lowest">Lowest to Highest</option>
                        <option value="highest">Highest to Lowest</option>
                    </select>
                </div>
            </div>
            {displaySection === 'ModifyPoints' && (
                <Form>
                    <p style={{ color: 'red' }}><strong>Song Price (USD):</strong> {editSong.collectionPrice}</p>
                    <p style={{ color: 'red' }}><strong>Current Price (Points):</strong> {editSong.collectionPrice *100}</p>
                    <Form.Input
                        label='Enter New Point Value'
                        placeholder='Enter New Point Value'
                        value={newPoints}
                        onChange={(e) => {
                            const input = e.target.value;
                            const validationMessage = validatePointsInput(input);
                            if (!validationMessage || validationMessage === "Point value cannot be empty.") {
                                setNewPoints(input);
                                setErrorMessage(validationMessage);
                            }
                        }}
                    />
                    <Button color='blue' onClick={updatePoints}>Update Points</Button>
                    <Button color='blue' onClick={back}>Back</Button>
                    {errorMessage && (
                        <Message error content={errorMessage} />
                    )}
                    {successMessage && (
                        <Message success content={successMessage} />
                    )}
                </Form>
            )}
            {displaySection === 'songs' && (
                <>
                    <div className="songs-grid">
                        {sortedSongsByPrice
                            .filter(song => selectedArtist === 'All Artists' || song.artistName === selectedArtist || song.trackName.includes(selectedArtist))
                            .map((song, index) => (
                                <div key={index} className="song-card">
                                    <img src={song.artworkUrl100} alt={song.trackName} className="song-image" />
                                    <div className="song-info">
                                        <input
                                            type="text"
                                            value={song.trackName}
                                            onChange={(e) => editProductName(index, e.target.value)}
                                        />
                                        <div className="song-artist">{song.artistName}</div>
                                        <div className="song-release-year">Release Year: {new Date(song.releaseDate).getFullYear()}</div>
                                        <div className="song-price">
                                            {song.discounted ? Math.round(song.collectionPrice * 0.9 * 100) : Math.round(song.collectionPrice * 100)} Points
                                            {!song.discounted && <button onClick={() => applyDiscount(index)}>Apply Discount</button>}
                                        </div>
                                        {(userRole === 'Sponsor' || userRole === 'Admin') && <button className="add-to-cart-btn" onClick={() => modifyPoints(song)}>Modify Points</button>}
                                        <button className="add-to-cart-btn" onClick={() => addToCart(song)}>Add to Cart</button>
                                        <button className="delete-from-catalog-btn" style={{ backgroundColor: 'red' }} onClick={() => deleteFromCatalog(index)}>Delete from Catalog</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <button onClick={resetCatalog}>Reset Catalog</button>
                </>
            )}
        </div>
    );
}

export default ProductCatalog;
