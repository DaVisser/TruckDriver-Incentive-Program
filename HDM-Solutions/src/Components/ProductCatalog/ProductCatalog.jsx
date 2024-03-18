import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductCatalog.css';

function ProductCatalog() {
    const [artistSongs, setArtistSongs] = useState([]);
    const [minPoints, setMinPoints] = useState(0);
    const [maxPoints, setMaxPoints] = useState(25000);

    const artistIds = {
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
                const songs = await fetchSongsForArtist(artistId);
                allSongs.push(...songs);
            }
            setArtistSongs(allSongs);
        };

        fetchAllSongs();
    }, []);

    const addToCart = (song) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        localStorage.setItem('cart', JSON.stringify([...cart, song]));
    };

    return (
        <div>
            <Link to="/cart">Go to Cart</Link>
            <div className="price-filter">
                <label>Min Points: </label>
                <input type="number" value={minPoints} onChange={(e) => setMinPoints(e.target.value)} />
                <label>Max Points: </label>
                <input type="number" value={maxPoints} onChange={(e) => setMaxPoints(e.target.value)} />
            </div>
            <div className="songs-grid">
                {artistSongs.filter(song => (song.collectionPrice * 100) >= minPoints && (song.collectionPrice * 100) <= maxPoints).map((song, index) => (
                    <div key={index} className="song-card">
                        <img src={song.artworkUrl100} alt={song.trackName} className="song-image" />
                        <div className="song-info">
                            <div className="song-title">{song.trackName}</div>
                            <div className="song-artist">{song.artistName}</div>
                            <div className="song-price">{Math.round(song.collectionPrice * 100)} Points</div>
                            <button className="add-to-cart-btn" onClick={() => addToCart(song)}>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductCatalog;
