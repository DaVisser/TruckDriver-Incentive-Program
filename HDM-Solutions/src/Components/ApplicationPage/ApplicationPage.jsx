import React, { useState, useEffect } from 'react';
import './ApplicationPage.css';

function TruckDriverProfile() {
  const [displaySection, setDisplaySection] = useState('updateProfile');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [licenseID, setLicenseID] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleApplicationSubmission = async () => {
    try {
      const response = await fetch('https://i0hrund9ya.execute-api.us-east-1.amazonaws.com/default/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          birthdate,
          phoneNumber,
          phoneNumber,
          gender,
          licenseID,
          sponsor
        }),
      });
      console.log(firstName);
      console.log(lastName);
      console.log(email);
      console.log(birthdate);
      console.log(phoneNumber);
      console.log(gender);
      console.log(licenseID);
      console.log(sponsor);
      console.log('API Response: ', response);
      if (response.ok) {
        setSuccessMessage('Support Ticket submitted successfully.');
      } else {
        const data = await response.json();
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
    }
};

  const handleSponsorChange = (event) => {
    const selectedSponsorName = event.target.value;
    const selectedSponsor = sponsorData.find(sponsor => sponsor.name === selectedSponsorName);
    setSelectedSponsor(selectedSponsor);
    setSponsor(selectedSponsorName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleApplicationSubmission();
    // Here you can add your submission logic, for example, submitting data to your backend
    // After successful submission, set the success message
    setSuccessMessage('Application submitted successfully!');
    // You may also want to reset the form fields after submission
    setFirstName('');
    setLastName('');
    setEmail('');
    setBirthdate('');
    setPhoneNumber('');
    setGender('');
    setLicenseID('');
    setSponsor('');
    setSelectedSponsor(null);
    // Reset success message after a delay
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); // Clear success message after 5 seconds
  };

  return (
    <div>
      <header className="header">
        <h4>Driver Applications</h4>
      </header>
      <button onClick={() => setDisplaySection('submitApplication')}>Create New Application</button>
      <button onClick={() => setDisplaySection('viewPreviousApplications')}>View Previous Applications</button>

      {displaySection === 'submitApplication' && (
        <form onSubmit={handleSubmit}>
          <label>
            First Name:<br />
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </label><br />
          <label>
            Last Name:<br />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </label><br />
          <label>
            Email:<br />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label><br />
          <label>
            Birthdate:<br />
            <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
          </label><br />
          <label>
            Phone Number:<br />
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </label><br />
          <label>
            Gender:<br />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label><br />
          <label>
            License ID:<br />
            <input type="text" value={licenseID} onChange={(e) => setLicenseID(e.target.value)} />
          </label><br />
          <div>
          <p>Choose Sponsor:</p>
          <select value={sponsor} onChange={(e) => setSponsor(e.target.value)}>
            <option value="">Select</option>
            {Array.isArray(sponsorData) ? sponsorData.map((sponsor, index) => (
              <option key={index} value={sponsor.name}>
                {sponsor.name}
              </option>
            )) : null}
          </select>
          </div>
          <button type="submit">Submit</button>
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      )}

      {displaySection === 'viewPreviousApplications' && (
        <div>
          <p>View Previous Applications Section</p>
        </div>
      )}
    </div>
  );
}

export default TruckDriverProfile;
