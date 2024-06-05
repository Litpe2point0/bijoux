import React from 'react';
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot, faFaceAngry, faFaceLaugh } from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/material';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-logo">
                <img src="../src/assets/bijoux_logo.jpg" alt="Bijoux Logo" className="logo" />
                <span className="brand-name">BIJOUX</span>
            </div>
            <div className="footer-links">
                <div className="footer-column">
                    <h4>Contact Informations</h4>
                    <Box className="footer-links-options">
                        <a href="#">
                            <FontAwesomeIcon icon={faPhone} /> 090909090
                        </a>
                    </Box>
                    <Box className="footer-links-options">
                        <a href="#">
                            <FontAwesomeIcon icon={faEnvelope} /> bijouxjewelry@gmail.com
                        </a>
                    </Box>
                    <Box className="footer-links-options">
                        <a href="#">
                            <FontAwesomeIcon icon={faLocationDot} /> FPT University, HCM, Vietnam
                        </a>
                    </Box>

                </div>
                <div className="footer-column">
                    <h4>Social Contact</h4>
                    <Box>
                        <a href="#">
                            <FontAwesomeIcon icon={faFaceLaugh} />
                        </a>
                    </Box>
                    <Box>
                        <a href="#">
                            <FontAwesomeIcon icon={faFaceLaugh} />
                        </a>
                    </Box>
                    <Box>
                        <a href="#">
                            <FontAwesomeIcon icon={faFaceLaugh} />
                        </a>
                    </Box>

                </div>
            </div>
            <div className="footer-social">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
            <div className="footer-copyright">
                <p>Copyright © since 2024 BIJOUX All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;