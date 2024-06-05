import React from 'react';
import { Box, Grid, Avatar, Link, IconButton, Menu, MenuItem, Typography, Divider } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';


// Importing the CSS file
import './header.css';
import '@coreui/coreui/dist/css/coreui.min.css'

export default function Header({ userImgUrl, userName }) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUserMenuClick = (event) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    return (
        <>
            <Box height={65} component="section" sx={{ border: '1px dashed grey' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6} sm={4}>
                        <Box
                            height={65}
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            pl={2} // Add padding left to ensure the margin from the edge
                        >
                            <div className='header-logo-name'>
                                <Avatar alt="Bijoux Logo" src="../src/assets/bijoux_logo.jpg" />
                                <span className='header-name'>BIJOUX</span>
                            </div>
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 5 }}>
                                <Link href="/" color={'black'} underline="hover">
                                    Home
                                </Link>
                                <Link href="/services" color={'black'} underline="hover">
                                    Services
                                </Link>
                                <Link href="/about" color={'black'} underline="hover">
                                    About Us
                                </Link>
                                <Link href="/blogs" color={'black'} underline="hover">
                                    Blogs
                                </Link>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={8}>
                        <Box
                            height={65}
                            display={'flex'}
                            justifyContent={'end'}
                            alignItems={'center'}
                            pr={2} // Add padding right to ensure the margin from the edge
                        >
                            <Box
                                className='user-informations'
                                display={{ xs: 'none', sm: 'flex' }}
                                alignItems={'center'}
                                gap={2} // Space between elements
                            >
                                <Avatar className='user-image' alt="Remy Sharp" src={userImgUrl} />
                                <p className='user-name'>{userName}</p>
                                <button onClick={handleUserMenuClick}> <ArrowDropDownIcon /></button>
                            </Box>
                            <Menu
                                anchorEl={userMenuAnchorEl}
                                open={Boolean(userMenuAnchorEl)}
                                onClose={handleUserMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={handleUserMenuClose}>
                                    <Link color={'inherit'} href="/profile" underline="hover">
                                        View Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleUserMenuClose}>
                                    <Link color={'inherit'} href="#" underline="hover">
                                        Sign Out
                                    </Link>
                                </MenuItem>
                            </Menu>
                            <IconButton
                                sx={{ display: { xs: 'flex', sm: 'none' }, ml: 'auto', mr: 2 }} // Align menu icon to the right
                                onClick={handleMenuClick}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                sx={{ mt: 1 }}
                            >
                                <MenuItem>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar alt="Remy Sharp" src={userImgUrl} />
                                        <Typography variant="body1">{userName}</Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem>
                                    <Link color={'inherit'} href="#" underline="hover">
                                        View Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose}>Home</MenuItem>
                                <MenuItem onClick={handleMenuClose}>Services</MenuItem>
                                <MenuItem onClick={handleMenuClose}>About Us</MenuItem>
                                <MenuItem onClick={handleMenuClose}>Blogs</MenuItem>
                                <Divider variant="middle" sx={{ my: 1, borderColor: 'gray', borderWidth: 1 }} />
                                <MenuItem onClick={handleMenuClose}>Signout</MenuItem>
                            </Menu>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
