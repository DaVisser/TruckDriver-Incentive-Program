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
  const [previousApplications, setPreviousApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]); // New state for filtered applications
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

  useEffect(() => {
    // Fetch previous applications data when component mounts or when license ID changes
    fetchPreviousApplications(licenseID);
  }, [licenseID]);

  // Fetch previous applications data
  const fetchPreviousApplications = async (licenseID) => {
    try {
      const response = await fetch('https://up3xfwc3d7.execute-api.us-east-1.amazonaws.com/default/team06-PreviousApplication');
      if (response.ok) {
        const data = await response.json();
        setPreviousApplications(data);
        if (licenseID) {
          // Filter applications based on the entered licenseID
          const filteredApps = data.filter(application => application.licenseID === licenseID);
          setFilteredApplications(filteredApps);
        }
      } else {
        console.error('Failed to fetch previous applications data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching previous applications data:', error);
    }
  };

  const handleLicenseIDChange = (event) => {
    setLicenseID(event.target.value);
  };

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
        setSuccessMessage('Driver Application submitted successfully.');
      } else {
        const data = await response.json();
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
    }
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
          <p>Enter LicenseID to find your previous applications.</p>
          <label>
            License ID:<br />
            <input type="text" value={licenseID} onChange={handleLicenseIDChange} />
          </label><br />
          {filteredApplications.length > 0 ? (
            <div>
              <h2>Previous Applications</h2>
              <ul>
                {filteredApplications.map((application, index) => (
                  <li key={index}>
                    {/* Render application details */}
                    <p>Name: {application.firstName} {application.lastName}</p>
                    <p>Email: {application.email}</p>
                    <p>Birthdate: {application.birthdate}</p>
                    <p>Phone Number: {application.phoneNumber}</p>
                    <p>Gender: {application.gender}</p>
                    <p>License ID: {application.licenseID}</p>
                    <p>Sponsor: {application.sponsor}</p>
                    {/* Render other application fields as needed */}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No applications found with the entered license ID.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TruckDriverProfile;
