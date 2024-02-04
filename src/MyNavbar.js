// Navbar.js

import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import logo from './coin.png'; // Replace with your logo file

const MyNavbar = () => {
  return (
    <Navbar style={{ backgroundColor: 'darkviolet' }} variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <img
              src={logo}
              width="50"
              height="35"
              className="d-inline-block align-top"
              alt="Your Logo"
            />
          </div>
          <div style={{ color: 'white' }}>
            <div style={{ borderBottom: '2px solid white', paddingBottom: '5px' }}></div>
            {'TARGETCOIN'}
            <div style={{ borderTop: '2px solid white', paddingTop: '5px' }}></div>
          </div>
        </Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
