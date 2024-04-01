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
