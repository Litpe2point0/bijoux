import { useState } from 'react'
import Header from './components/DesignLayout/header/header'
import Footer from './components/DesignLayout/footer/footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import Home from './page/Home/home';
import Services from './page/Service/service';
import Template from './page/Service/serviceOptions/Template/template';
import SelectMounting from './page/Service/serviceOptions/Template/selectMounting';
import SelectDiamond from './page/Service/serviceOptions/Template/selectDiamond';
import CompleteJewelry from './page/Service/serviceOptions/Template/completeJewelry';
import Customization from './page/Service/serviceOptions/Customization/customization';
import About from './page/About/about';
import Blog from './page/Blogs/blog';
import Profile from './page/Profile/profile';
import EditProfile from './page/Profile/editProfile';
import Quote from './page/Profile/Quote/quote';
import PricedQuote from './page/Profile/Quote/pricedQuote';
import Order from './page/Profile/Order/order';
import DesignProcess from './page/Profile/Order/designProcess';
import Payment from './page/Profile/Payment/payment';

function App() {

  const [userImgUrl, setUserImgUrl] = useState("https://i.pinimg.com/564x/f6/17/6d/f6176dc824601ad3c4865e62804aaf70.jpg");
  const [userName, setUserName] = useState("Hoàng Minh Lộc");

  return (
    <Router>
      <Header userImgUrl={userImgUrl} userName={userName} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/template" element={<Template />} />
          <Route path="/services/template/mounting" element={<SelectMounting />} />
          <Route path="/services/template/diamond" element={<SelectDiamond />} />
          <Route path="/services/template/complete" element={<CompleteJewelry />} />
          <Route path="/services/customization" element={<Customization />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/profile" element={<Profile />}>
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/profile/view-quote" element={<Quote />} />
            <Route path="/profile/view-priced-quote" element={<PricedQuote />} />
            <Route path="/profile/view-order" element={<Order />} />
            <Route path="/profile/design-process" element={<DesignProcess />} />
            <Route path="/profile/payment" element={<Payment />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App
