import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'rgb(1, 6, 48)' }} className=" text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Classy-Cruises. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
