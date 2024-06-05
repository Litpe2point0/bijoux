import React from "react";
import { CSidebar, CSidebarHeader, CSidebarBrand, CNavTitle, CNavItem, CNavGroup, CSidebarNav } from '@coreui/react';
import { Box } from '@mui/material';
import { SketchLogo, UserCircle, Bookmarks, ShoppingBagOpen, CurrencyCircleDollar } from "@phosphor-icons/react";
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Profile() {

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate.push(path);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ height: '100vh', width: '4%' }}>
                <CSidebar className="border-end" unfoldable visible="false">
                    <CSidebarHeader className="border-bottom">
                        <CSidebarBrand><SketchLogo size={32} /></CSidebarBrand>
                    </CSidebarHeader>
                    <CSidebarNav>
                        <CNavTitle>Your Profile</CNavTitle>
                        <CNavItem onClick={() => handleNavigation("/profile")} ><UserCircle className="nav-icon" size={32} />Edit Profile</CNavItem>
                        <CNavGroup
                            toggler={
                                <>
                                    <Bookmarks className="nav-icon" size={32} /> View Quote
                                </>
                            }
                        >
                            <CNavItem onClick={() => handleNavigation("/profile/view-quote")} ><span className="nav-icon"><span className="nav-icon-bullet"></span></span> Quotes</CNavItem>
                            <CNavItem onClick={() => handleNavigation("/profile/view-priced-quote")} ><span className="nav-icon"><span className="nav-icon-bullet"></span></span> Priced Quotes  </CNavItem>
                        </CNavGroup>
                        <CNavGroup
                            toggler={
                                <>
                                    <ShoppingBagOpen className="nav-icon" size={32} /> View Order
                                </>
                            }
                        >
                            <CNavItem onClick={() => handleNavigation("/profile/view-order")} ><span className="nav-icon"><span className="nav-icon-bullet"></span></span> Orders</CNavItem>
                            <CNavItem onClick={() => handleNavigation("/profile/design-process")} ><span className="nav-icon"><span className="nav-icon-bullet"></span></span> Design Process</CNavItem>

                        </CNavGroup>
                        <CNavItem onClick={() => handleNavigation("/profile/payment")}><CurrencyCircleDollar className="nav-icon" size={32} /> Payment</CNavItem>
                    </CSidebarNav>
                </CSidebar>
            </Box>
            <Box sx={{ width: '96%' }}>
                <Outlet />
            </Box>
        </Box>
    );
}
