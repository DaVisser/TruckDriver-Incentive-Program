import React, { useState } from 'react';

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

  // Here you can use useEffect or any other mechanism to fetch and set driverInfo

  return (
    <div>
      <h1>Truck Driver Applications</h1>
      <button onClick={() => setDisplaySection('submitApplication')}>Create New Application</button>
      <button onClick={() => setDisplaySection('viewPreviousApplications')}>View Previous Applications</button>

      {displaySection === 'submitApplication' && (
        <form>
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
          <label>
            Choose Sponsor:<br />
            <select value={sponsor} onChange={(e) => setSponsor(e.target.value)}>
              <option value="">Select</option>
              <option value="sponsor1">Sponsor 1</option>
              <option value="sponsor2">Sponsor 2</option>
              <option value="sponsor3">Sponsor 3</option>
            </select>
          </label><br />
          <button type="submit">Submit</button>
        </form>
      )}

      {displaySection === 'viewPreviousApplications' && (
        <div>
          {/* Placeholder for viewing previous applications */}
          <p>View Previous Applications Section</p>
        </div>
      )}
    </div>
  );
}

export default TruckDriverProfile;
