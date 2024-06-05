import React from 'react';
import { Box } from '@mui/material';
import { CCarousel, CCarouselItem, CImage, CCarouselCaption, CButton, CFooter, CLink } from '@coreui/react';
import './home.css';


export default function Home() {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <h1 className="masterpiece-heading">Our Masterpices Collections</h1>
            </Box>

            <Box className="collections-image">
                <div style={{ width: '20%' }}>
                    <CCarousel controls indicators dark style={{ width: '100%' }} >
                        <CCarouselItem>
                            <CImage className="d-block w-100 carousel-image" src="https://i.pinimg.com/564x/2b/51/3f/2b513f40c0b9090207162efc2b29bb7b.jpg" alt="slide 1" />
                        </CCarouselItem>
                        <CCarouselItem>
                            <CImage className="d-block w-100 carousel-image" src="https://i.pinimg.com/564x/e1/96/78/e19678e7daae0857dd16ae59184c352a.jpg" alt="slide 2" />
                        </CCarouselItem>
                        <CCarouselItem>
                            <CImage className="d-block w-100 carousel-image" src="https://i.pinimg.com/564x/46/22/7f/46227fe4cd3c7630b6a0f09a2ae847ce.jpg" alt="slide 3" />
                        </CCarouselItem>
                        <CCarouselItem>
                            <CImage className="d-block w-100 carousel-image" src="https://i.pinimg.com/736x/b8/6f/e7/b86fe79ef0fd8433bceb170c745c1ed7.jpg" alt="slide 1" />
                        </CCarouselItem >
                        <CCarouselItem>
                            <CImage className="d-block w-100 carousel-image" src="https://i.pinimg.com/564x/42/c0/8f/42c08f7e265c3f06f984b989070b2795.jpg" alt="slide 2" />
                        </CCarouselItem>
                        <CCarouselItem>
                            <CImage className="d-block w-100 carousel-image" src="https://i.pinimg.com/564x/1c/db/10/1cdb102be916b26844f813b884b7ecf2.jpg" alt="slide 3" />
                        </CCarouselItem>
                    </CCarousel>
                </div>
            </Box>

            <Box gap={3} sx={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                <Box>
                    <CImage className="d-block w-1" src="https://i.pinimg.com/564x/4c/b4/22/4cb422933d78f641dc6b33662ed03ed4.jpg" alt="template-image" />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3>Design a Jewelry by template</h3>
                    <Box width={550}>
                        <p>Feel free to design by yourself with our free templates. You can choose each available detail to combine into a finished product</p>
                    </Box>
                    <CButton href='/services/template' color="dark">Design Now</CButton>
                </Box>
            </Box>

            <Box gap={3} sx={{ display: 'flex', justifyContent: 'center', marginTop: '60px', marginBottom: '60px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3>Design a jewelry by your own ideas</h3>
                    <Box width={550}>
                        <p>Can’t find your design from the templates ?
                            Don’t worry, we have our own consultant team to support you ! We will listen to your idea and realize it</p>
                    </Box>
                    <CButton href='/services/customization' color="dark">Contact Now</CButton>
                </Box>
                <Box>
                    <CImage className="d-block w-1" src="https://i.pinimg.com/564x/8d/85/7d/8d857d7873db1734733b0982b1f0aea6.jpg" alt="template-image" />
                </Box>
            </Box>
        </>
    );
}