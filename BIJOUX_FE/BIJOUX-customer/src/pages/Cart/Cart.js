import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Archive, ShoppingCartSimple, CurrencyCircleDollar, SketchLogo } from 'phosphor-react';
import { IoChevronBackOutline } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { List, ListItem } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
const Cart = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className='flex'>
      <div className='fixed w-[50px] h-[50px] flex items-center justify-center rounded-md bg-slate-300 mt-2 ml-2'>
        <FiMenu onClick={() => setIsDrawerOpen(true)} size={35} className='text-black hover:text-indigo-500' />
      </div>
      {/* <div className='h-screen flex-col hidden md:flex bg-[#3e4f6a] rounded-r-xl'>
        <div className='flex items-center justify-center'>
          <SketchLogo size={20} color="white" />
          <h2 className='text-white font-rootFont font-semibold text-xl mt-5 ml-2 mb-5'>Bijoux</h2>
        </div>
        <div className='w-full justify-center flex items-center'>
          <div className='w-10/12 h-0.5 bg-white'></div>
        </div>
        <List className='font-rootFont font-semibold text-white'>

          <ListItem button onClick={handleQuoteClick}>
            <Archive className='mr-2' size={20} />
            <Link to="quote" style={{ marginLeft: '8px', textDecoration: 'none', color: 'inherit' }}>
              View Quote
            </Link>
          </ListItem>


          <ListItem button onClick={handleOrderClick}>
            <ShoppingCartSimple className="mr-2" size={20} />
            <Link to="order" style={{ marginLeft: '8px', textDecoration: 'none', color: 'inherit' }}>
              View Order
            </Link>
          </ListItem>


          <ListItem button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CurrencyCircleDollar className='mr-2' size={20} />
              <Link to="payment" style={{ marginLeft: '8px', textDecoration: 'none', color: 'inherit' }}>
                Payment
              </Link>
            </div>
          </ListItem>
        </List>
      </div> */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-20 left-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-start z-20"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-52 flex flex-col font-semibold items-start top-20 left-0 h-full bg-white shadow-lg p-4"
            >
              <div className='flex justify-center items-center'>
                <p className='text-lg text-[#151542]'>BIJOUX</p>
              </div>
              <div className='w-10/12 h-0.5 bg-[#151542] my-2'></div>
              <div onClick={() => setIsDrawerOpen(false)} className='flex items-center mb-5 hover:text-indigo-600'>
                <Archive className='mr-2' size={30} />
                <Link to="quote" style={{ marginLeft: '8px', textDecoration: 'none', color: 'inherit' }}>
                  View Quote
                </Link>
              </div>
              <div onClick={() => setIsDrawerOpen(false)} className='flex items-center mb-5 hover:text-indigo-600'>
                <ShoppingCartSimple className="mr-2" size={30} />
                <Link to="order" style={{ marginLeft: '8px', textDecoration: 'none', color: 'inherit' }}>
                  View Order
                </Link>
              </div>
              <div onClick={() => setIsDrawerOpen(false)} className='flex items-center mb-5 hover:text-indigo-600'>
                <CurrencyCircleDollar className='mr-2' size={30} />
                <Link to="payment" style={{ marginLeft: '8px', textDecoration: 'none', color: 'inherit' }}>
                  Payment
                </Link>
              </div>
            </motion.div>
            <div className='w-[40px] h-[40px] ml-[1px] flex items-center justify-center bg-white rounded-r-md'>
              <IoChevronBackOutline
                size={35}
                onClick={() => setIsDrawerOpen(false)}
                className='text-black hover:text-indigo-500 cursor-pointer'
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      <div className='w-full h-auto'>
        <Outlet />
      </div>

    </div>
  );
};

export default Cart;