import React from "react";
import { CSidebar, CSidebarHeader, CSidebarBrand, CNavTitle, CNavItem, CNavGroup, CSidebarNav } from '@coreui/react';
import { Box } from '@mui/material';
import { SketchLogo, UserCircle, Bookmarks, ShoppingBagOpen, CurrencyCircleDollar } from "@phosphor-icons/react";
import { Outlet, useNavigate } from 'react-router-dom';

export default function Profile() {

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ height: '100vh', width: '3.8%' }}> {/* Điều chỉnh chiều rộng Sidebar */}
                <CSidebar className="border-end" unfoldable>
                    <CSidebarHeader className="border-bottom">
                        <CSidebarBrand><SketchLogo size={32} /></CSidebarBrand>
                    </CSidebarHeader>
                    <CSidebarNav>
                        <CNavTitle>Your Profile</CNavTitle>
                        <CNavItem href="/profile">
                            <UserCircle className="nav-icon" size={32} />Edit Profile
                        </CNavItem>
                        <CNavGroup
                            toggler={
                                <>
                                    <Bookmarks className="nav-icon" size={32} /> View Quote
                                </>
                            }
                        >
                            <CNavItem href="/profile/view-quote">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span> Quotes
                            </CNavItem>
                            <CNavItem href="/profile/view-priced-quote">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span> Priced Quotes
                            </CNavItem>
                        </CNavGroup>
                        <CNavGroup
                            toggler={
                                <>
                                    <ShoppingBagOpen className="nav-icon" size={32} /> View Order
                                </>
                            }
                        >
                            <CNavItem href="/profile/view-order">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span> Orders
                            </CNavItem>
                            <CNavItem href="/profile/design-process">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span> Design Process
                            </CNavItem>
                        </CNavGroup>
                        <CNavItem href="/profile/payment">
                            <CurrencyCircleDollar className="nav-icon" size={32} /> Payment
                        </CNavItem>
                    </CSidebarNav>
                </CSidebar>
            </Box>
            <Box sx={{ flex: 1, margin: '30px' }}> {/* Điều chỉnh chiều rộng nội dung */}
                <Outlet />
            </Box>
        </Box>
    );
}
