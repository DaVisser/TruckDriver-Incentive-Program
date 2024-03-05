import React, { useState, useEffect } from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import './AboutPage.css';
import trucker1 from '../Assets/trucker1.jpg';
import trucker2 from '../Assets/trucker2.jpg';
import trucker3 from '../Assets/trucker3.jpg';
import trucker4 from '../Assets/trucker4.jpg';
import trucker5 from '../Assets/trucker5.jpg';
import trucker6 from '../Assets/trucker6.jpg';
import trucker7 from '../Assets/trucker7.jpg';
import trucker8 from '../Assets/trucker8.jpg';
import trucker9 from '../Assets/trucker9.jpg';
import trucker10 from '../Assets/trucker10.jpg';

const images = [
  trucker1,
  trucker2,
  trucker3,
  trucker4,
  trucker5,
  trucker6,
  trucker7,
  trucker8,
  trucker9,
  trucker10
];

function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slideshow-container">
      <img src={images[index]} alt="Truck slideshow" />
    </div>
  );
}

function AboutPage() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>Welcome to HDM Solutions</h1>
      </header>
      <section className="about-content">
        <p>
          At HDM Solutions, we are revolutionizing the trucking industry. Our innovative Good Truck Driver Incentive Program is designed to promote safe and efficient driving behaviors, benefiting both our drivers and the environment. As a technology-driven company, we leverage a sophisticated web application to incentivize outstanding on-road performance, offering a dynamic catalog of rewards and a seamless user experience for our drivers and sponsor companies. Our commitment to excellence, safety, and sustainability drives us forward, as we strive to set new industry standards and build lasting relationships with our clients and community.
        </p>
        <p>
          We are proud to work with a network of dedicated professionals and to use cutting-edge technology to bring positive change to the trucking industry. Join us on our journey as we pave the way for a safer, more efficient, and more rewarding future in transportation.
        </p>
      </section>
      <Slideshow />
      <footer className="about-footer">
        <p>Contact us at hdmsolutions@gmail.com</p>
      </footer>
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>What is the Good Truck Driver Incentive Program?</h3>
          <p>The Good Truck Driver Incentive Program is a program designed by HDM Solutions to promote safe and efficient driving behaviors among truck drivers. It offers rewards and incentives for outstanding on-road performance.</p>
        </div>
        <div className="faq-item">
          <h3>How does the program work?</h3>
          <p>Drivers enrolled in the program are provided with a web application that tracks their driving behavior. Safe and efficient driving is rewarded with points, which can be redeemed for various rewards.</p>
        </div>
        <div className="faq-item">
          <h3>What rewards are available?</h3>
          <p>The rewards catalog includes a variety of options, such as gift cards, merchandise, and special privileges. The catalog is regularly updated with new offerings.</p>
        </div>
        <div className="faq-item">
          <h3>How can I join the program?</h3>
          <p>For information on joining the Good Truck Driver Incentive Program, please contact our team at hdmsolutions@gmail.com.</p>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
