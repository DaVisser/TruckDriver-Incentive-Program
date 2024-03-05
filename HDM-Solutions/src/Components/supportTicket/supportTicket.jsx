import React, { useState } from 'react';
import './supportTicket.css';

function SupportTicketForm() {
    const [prompt, setPrompt] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Submitting form with values:', { prompt, phoneNumber });
        setPrompt('');
        setPhoneNumber('');
        setShowForm(false);
    };

    return (
        <div>
            <button onClick={() => setShowForm(true)}>Submit a Ticket</button>
            {showForm && (
                <div className="form-container">
                    <h2>Submit a Support Ticket</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="prompt">Prompt:</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(event) => setPrompt(event.target.value)}
                                placeholder="Enter your prompt here"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number (to call back):</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default SupportTicketForm;
