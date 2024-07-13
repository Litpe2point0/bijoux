import React, { useEffect, useState } from "react";
import { BsGridFill } from "react-icons/bs";
import { ImList } from "react-icons/im";
import { GoTriangleDown } from "react-icons/go";
import { get_mounting_style_list } from "../../../api/main/items/Model_api";

const ModelBanner = ({ currentStyle, currentItemsPerPage,itemsPerPageFromBanner, handleSort }) => {
  const [selected, setSelected] = useState(0);
  const [girdViewActive, setGridViewActive] = useState(true);
  const [listViewActive, setListViewActive] = useState(false);
  const [styleList, setStyleList] = useState([]);
  // useEffect(() => {
  //   const gridView = document.querySelector(".gridView");
  //   const listView = document.querySelector(".listView");

  //   gridView.addEventListener("click", () => {
  //     setListViewActive(false);
  //     setGridViewActive(true);
  //   });
  //   listView.addEventListener("click", () => {
  //     setGridViewActive(false);
  //     setListViewActive(true);
  //   });
  // }, [girdViewActive, listViewActive]);

  useEffect(() => {
    const setAttribute = async() => {
      const style_list= await get_mounting_style_list();
      setStyleList(style_list.data); 
    }
    setAttribute();
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
      {/* =========================================================
                            Left Part Start here
        ======================================================== */}

      {/* <div className="flex items-center gap-4">
        <span
          className={`${
            girdViewActive
              ? "bg-primeColor text-white"
              : "border-[1px] border-gray-300 text-[#737373]"
          } w-8 h-8 text-lg flex items-center justify-center cursor-pointer gridView`}
        >
          <BsGridFill />
        </span>
        <span
          className={`${
            listViewActive
              ? "bg-primeColor text-white"
              : "border-[1px] border-gray-300 text-[#737373]"
          } w-8 h-8 text-base flex items-center justify-center cursor-pointer listView`}
        >
          <ImList />
        </span>
      </div> */}
      {/* =========================================================
                            Left Part End here
        ======================================================== */}
      {/* =========================================================
                            Right Part STart here
        ======================================================== */}
      <div className="d-flex justify-content-start">
        <div className="flex items-center gap-2 text-base text-[#767676] relative">
          <label className="block">Sort by:</label>
          <select
            value={currentStyle}
            onChange={(e) => handleSort(e.target.value)}
            id="countries"
            className="w-32 md:w-52 border-[1px] border-gray-200 py-1 px-4 cursor-pointer text-primeColor text-base block dark:placeholder-gray-400 appearance-none focus-within:outline-none focus-visible:border-primeColor"
          >
            <option value={0}>All Style</option>
            {styleList.length > 0 &&
            styleList.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))
            }
            {/* <option value={1}>Style 1</option>
            <option value={2}>Style 2</option>
            <option value={3}>Featured id 1</option>
            <option value={4}>Final Offer id 1</option> */}
          </select>
          <span className="absolute text-sm right-2 md:right-4 top-2.5">
            <GoTriangleDown />
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#767676] relative">
          <label className="block">Show:</label>
          <select
            value={currentItemsPerPage}
            onChange={(e) => itemsPerPageFromBanner(+e.target.value)}
            id="countries"
            className="w-16 md:w-20 border-[1px] border-gray-200 py-1 px-4 cursor-pointer text-primeColor text-base block dark:placeholder-gray-400 appearance-none focus-within:outline-none focus-visible:border-primeColor"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <span className="absolute text-sm right-3 top-2.5">
            <GoTriangleDown />
          </span>
        </div>
      </div>
      {/* =========================================================
                            Right Part End here
        ======================================================== */}
    </div>
  );
};

export default ModelBanner;
