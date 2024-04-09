import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductCatalog.css';

function ProductCatalog() {
    const [artistSongs, setArtistSongs] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState('');

    const artistIds = {
        'All Artists': '',
        'Drake': 271256,
        'Future': 128050210,
        '21 Savage': 894820464,
        'Lil Baby': 1276656483,
        'Gunna': 1236267297
    };

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

    return (
        <div>
            <Link to="/cart">Go to Cart</Link>
            <div className="artist-filter">
                <label>Filter by Artist: </label>
                <select value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)}>
                    {Object.keys(artistIds).map(artist => (
                        <option key={artist} value={artist}>{artist}</option>
                    ))}
                </select>
            </div>
            <div className="songs-grid">
                {artistSongs.filter(song => selectedArtist === 'All Artists' || song.artistName === selectedArtist || song.trackName.includes(selectedArtist)).map((song, index) => (
                    <div key={index} className="song-card">
                        <img src={song.artworkUrl100} alt={song.trackName} className="song-image" />
                        <div className="song-info">
                            <div className="song-title">{song.trackName}</div>
                            <div className="song-artist">{song.artistName}</div>
                            <div className="song-price">
                                {song.discounted ? Math.round(song.collectionPrice * 0.9 * 100) : Math.round(song.collectionPrice * 100)} Points
                                {!song.discounted && <button onClick={() => applyDiscount(index)}>Apply Discount</button>}
                            </div>
                            <button className="add-to-cart-btn" onClick={() => addToCart(song)}>Add to Cart</button>
                            <button className="delete-from-catalog-btn" style={{ backgroundColor: 'red' }} onClick={() => deleteFromCatalog(index)}>Delete from Catalog</button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={resetCatalog}>Reset Catalog</button>
        </div>
    );
}

export default ProductCatalog;
