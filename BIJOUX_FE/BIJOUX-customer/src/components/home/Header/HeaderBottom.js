import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { paginationItems } from "../../../constants";
import { BsSuitHeartFill } from "react-icons/bs";
import { clearAuthToken } from "../../../redux/auth/authSlice";
import { Avatar } from "@mui/material";
import "./pyramid.css"
import "./typeWriting.css"

const HeaderBottom = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const auth = useSelector((state) => state.auth);

  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [show, ref]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  //Check xem co' user hay khong
  const [isUser, setIsUser] = useState(false);
  //Co thi set avatar vao day
  const [userAvatar, setUserAvatar] = useState();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filtered = paginationItems.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);
  useEffect(() => {
    if (auth.user && auth.token) {
      setIsUser(true);
      setUserAvatar(auth.user.imageUrl);
    }
  }, [auth])

  const handleLogout = () => {

    dispatch(clearAuthToken());
  }
  const handleLogin = () => {
    const redirectUrl = window.location.href;
    localStorage.setItem('redirectUrl', redirectUrl);
  }
  return (
    <div className="w-full bg-[#faf5de] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div class="card sm:ml-12 md:ml-0">
            <div class="loader">
              <div class="words">
                <span class="word">Welcome To Bijoux</span>
                <span class="word">We Make Your Dreams Come True</span>
                <span class="word">Design Your Own Masterpiece</span>
                <span class="word">What are you waiting for?</span>
                <span class="word">Try It Now!</span>
                <span class="word">Unleash Your Creativity</span>
                <span class="word">Jewelry Like Never Before</span>
                <span class="word">Crafted With Love</span>
                <span class="word">Your Style, Your Way</span>
                <span class="word">Join The Bijoux Family</span>
              </div>
            </div>
          </div>


          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex">
              {/* <FaUser />
              <FaCaretDown /> */}
              <Avatar alt="User Avatar" src={userAvatar} />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-11 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                {(auth.user && auth.token) ?
                  <>
                    <Link to="/profile" onClick={handleLogin}>
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Profile
                      </li>
                    </Link>
                    <Link to="/login" onClick={handleLogout}>
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Log Out
                      </li>
                    </Link>
                  </>
                  :
                  <>
                    <Link to="/login" onClick={handleLogin}>
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Log In
                      </li>
                    </Link>
                    <Link onClick={() => setShowUser(false)} to="/register">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Register
                      </li>
                    </Link>
                  </>
                }
              </motion.ul>
            )}
            <Link to="/cart/quote">
              <div className="relative">
                <FaShoppingCart />
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
