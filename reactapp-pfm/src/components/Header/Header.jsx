import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, NavDropdown, Nav, Dropdown } from "react-bootstrap";

import "./style.css";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <>
      <Navbar variant="light" expand="lg" sticky="top" className="navBar">
        {/*
        <Container>
        */}
        <Navbar.Brand href="/home">
          <span>FMS</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to={"/home"} className="nav-link">
              <i className="bi bi-house-fill"></i>
              Home
            </Link>
          </Nav>
        </Navbar.Collapse>
        {/*
        </Container>
        */}
      </Navbar>
    </>
  );
};

export default Header;
