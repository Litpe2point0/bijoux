import React, { useEffect } from "react";
import Banner from "../../components/Banner/Banner";
import BannerBottom from "../../components/Banner/BannerBottom";
import BestSellers from "../../components/home/BestSellers/BestSellers";
import NewArrivals from "../../components/home/NewArrivals/NewArrivals";
import Sale from "../../components/home/Sale/Sale";
import SpecialOffers from "../../components/home/SpecialOffers/SpecialOffers";
import YearProduct from "../../components/home/YearProduct/YearProduct";
import JewelryBanner from "../../components/home/Sale/jewelryBanner";
import DiamondBanner from "../../components/home/Sale/diamondsBanner";
import Collection from "../../components/home/Sale/collection";
import { get_shape_list } from "../../api/main/items/Diamond_api";
const Home = () => {
  return (
    <div className="w-full mx-auto">
      <Banner />
      <BannerBottom />
      {/* <div className="max-w-container mx-auto px-4">
        <Sale />
      </div> */}
      <JewelryBanner />
      <DiamondBanner />
      <Collection />
    </div>
  );
};

export default Home;
