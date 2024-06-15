import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Collapse, IconButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Archive, ShoppingCartSimple, CurrencyCircleDollar, SketchLogo } from 'phosphor-react';

const Cart = () => {

  const [quoteOpen, setQuoteOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  const handleQuoteClick = () => {
    setQuoteOpen(!quoteOpen);
  };

  const handleOrderClick = () => {
    setOrderOpen(!orderOpen);
  };

  return (
    <div style={{ display: 'flex' }}>

      <div className='h-screen w-52 bg-[#3e4f6a] rounded-r-xl'>
        <div className='flex items-center justify-start ml-5'>
          <SketchLogo size={40} color="white" />
          <h2 className='text-white font-rootFont font-semibold text-3xl mt-5 ml-2 mb-5'>Bijoux</h2>
        </div>
        <div className='w-full justify-center flex items-center'>
          <div className='w-10/12 h-0.5 bg-white'></div>
        </div>
        <List className='font-rootFont font-semibold text-white'>
          {/* Quote Section */}
          <ListItem button onClick={handleQuoteClick}>
            <Archive className='mr-2' size={20} />
            <ListItemText primaryTypographyProps={{ fontFamily: 'Roboto, sans-serif', fontWeight: '600' }} primary="Quote" />
            {quoteOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={quoteOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button style={{ paddingLeft: 32 }}>
                <li><Link to="quote">View Quote</Link></li>
              </ListItem>
              <ListItem button style={{ paddingLeft: 32 }}>
                <li><Link to="priced-quote">View Priced Quote</Link></li>
              </ListItem>
            </List>
          </Collapse>

          {/* Order Section */}
          <ListItem button onClick={handleOrderClick}>
            <ShoppingCartSimple className="mr-2" size={20} />
            <ListItemText primaryTypographyProps={{ fontFamily: 'Roboto, sans-serif', fontWeight: '600' }} primary="Order" />
            {orderOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={orderOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button style={{ paddingLeft: 32 }}>
                <li><Link to="order">View Order</Link></li>
              </ListItem>
              <ListItem button style={{ paddingLeft: 32 }}>
                <li><Link to="design-process">View Design Process</Link></li>
              </ListItem>
            </List>
          </Collapse>

          {/* Payment Section */}
          <ListItem button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CurrencyCircleDollar size={20} />
              <Link to="payment" style={{ marginLeft: '8px', textDecoration: 'none', color: 'inherit' }}>
                Payment
              </Link>
            </div>
          </ListItem>
        </List>
      </div>



      <div className='w-full h-auto' style={{ flex: 1, padding: '10px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Cart;