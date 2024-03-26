import React, { useState, useEffect } from 'react';

function OurSponsors() {
  const [sponsorData, setSponsorData] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  useEffect(() => {
    const fetchSponsorData = async () => {
      try {
        const response = await fetch('https://5tdz19ogqf.execute-api.us-east-1.amazonaws.com/default/team06-SponsorInformation');
        if (response.ok) {
          const data = await response.json();
          setSponsorData(data); // Set sponsorData to the array
        } else {
          console.error('Failed to fetch sponsor data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching sponsor data:', error);
      }
    };
    fetchSponsorData();
  }, []);

  const handleSponsorChange = (event) => {
    const selectedSponsorName = event.target.value;
    const selectedSponsor = sponsorData.find(sponsor => sponsor.name === selectedSponsorName);
    setSelectedSponsor(selectedSponsor);
  };

  return (
    <div>
      <header className="header">
        <h4>Our Sponsors</h4>
      </header>
      <div>
        <p>Choose Sponsor:</p>
        <select onChange={handleSponsorChange}>
          <option value="">Select</option>
          {Array.isArray(sponsorData) ? sponsorData.map((sponsor, index) => (
            <option key={index} value={sponsor.name}>
              {sponsor.name}
            </option>
          )) : null}
        </select>
      </div>
      <div>
        <p>Sponsor Details:</p>
        {selectedSponsor && (
          <div>
            <p>Name: {selectedSponsor.name}</p>
            <p>Number of Employees: {selectedSponsor.num_employees}</p>
            <p>Number of Locations: {selectedSponsor.num_locations}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </div>
    </div>
  );
}

export default OurSponsors;
