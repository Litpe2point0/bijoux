import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";
import { logo, logoLight } from "../../../assets/images";
import Image from "../../designLayouts/Image";
import { navBarList } from "../../../constants";
import Flex from "../../designLayouts/Flex";

const Header = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(true);
  const [sidenav, setSidenav] = useState(false);
  const [category, setCategory] = useState(false);
  const [brand, setBrand] = useState(false);
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  console.log(location.pathname);
  console.log("hello");
  useEffect(() => {
    let ResponsiveMenu = () => {
      if (window.innerWidth < 667) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    };
    ResponsiveMenu();
    window.addEventListener("resize", ResponsiveMenu);
  }, []);

  const handleNavigate = (id) => {
    localStorage.removeItem("mountingType");
    localStorage.removeItem("finalProduct");
    localStorage.removeItem("currentStep");
    localStorage.removeItem("nextStep");
    window.location.href = `/template?step=1&mountingType=${id}`;
  }
  const handleNavigatePage = (path) => {
    navigate(path);
  }

  return (
    <div className="w-full h-20 bg-white sticky top-0 z-50 border-b-[1px] border-b-gray-200">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          <Link to="/">
            <div className="flex items-center">
              <Image className="w-16 object-cover mr-5" imgSrc={logo} />
              <h1 className="font-loraFont text-5xl font-light text-[#151542] hover:cursor-pointer">BIJOUX</h1>
            </div>
          </Link>
          <div>
            {showMenu && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center w-auto z-50 p-0 gap-2"
              >
                <>
                  {/* <div
                    className="relative inline-block md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0 py-1">

                  </div> */}
                  <div
                    className="relative inline-block md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0 py-1">
                    <NavLink
                      key={1001}
                      className="flex  text-sm font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                      to={"/"}
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      <li>Home</li>
                    </NavLink>
                  </div>
                  <div
                    className="relative inline-block md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0 py-1">
                    <NavLink
                      key={1002}
                      className="flex  text-sm font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                      to={"/services"}
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      <li>Services</li>
                    </NavLink>
                  </div>
                  <div
                    className="relative inline-block md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0 py-1">
                    <NavLink
                      key={1005}
                      className="flex  text-sm font-normal hover:font-bold w-[120px] h-6 justify-center items-center px-12 text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                      to={"/customization"}
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      <li>Customization</li>
                    </NavLink>
                  </div>




                  <div
                    className="relative inline-block md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0 py-1"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <NavLink
                      key={1006}
                      className="flex  text-sm font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626]  hoverEffect "
                      to="/templates"
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      <li>Templates</li>
                    </NavLink>
                    {isDropdownOpen && (
                      <div className="absolute top-[20px] mt-2 w-40 bg-black text-white rounded-md shadow-lg" >
                        <NavLink
                          onClick={() => handleNavigate(1)}
                          //to='/template?step=1&mountingType=1'
                          className="block px-4 py-2 text-sm hover:bg-gray-700 hover:rounded-md"
                        >
                          Ring
                        </NavLink>
                        <NavLink
                          onClick={() => handleNavigate(2)}
                          //to='/template?step=1&mountingType=2'
                          className="block px-4 py-2 text-sm hover:bg-gray-700 hover:rounded-md"
                        >
                          Band
                        </NavLink>
                        <NavLink
                          onClick={() => handleNavigate(3)}
                          //to='/template?step=1&mountingType=3'
                          className="block px-4 py-2 text-sm hover:bg-gray-700 hover:rounded-md"
                        >
                          Pendant
                        </NavLink>

                      </div>
                    )}
                  </div>

                  <div
                    className="relative inline-block md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0 py-1">
                    <NavLink
                      key={1003}
                      className="flex  text-sm font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                      to={"/about"}
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      <li>About</li>
                    </NavLink>
                  </div>

                  <div
                    className="relative inline-block md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0 py-1">
                    <NavLink
                      key={1004}
                      className="flex  text-sm font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                      to={"/contact"}
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      <li>Contact</li>
                    </NavLink>
                  </div>




                </>
              </motion.ul>
            )}
            <HiMenuAlt2
              onClick={() => setSidenav(!sidenav)}
              className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-4"
            />
            {sidenav && (
              <div className="fixed top-0 left-0 w-full h-screen bg-black text-gray-200 bg-opacity-80 z-50">
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-[80%] h-full relative"
                >
                  <div className="w-full h-full bg-primeColor p-6">
                    <img
                      className="w-28 mb-6"
                      src={logoLight}
                      alt="logoLight"
                    />
                    <ul className="text-gray-200 flex flex-col gap-2">
                      {navBarList.map((item) => (
                        <li
                          className="font-normal hover:font-bold items-center text-lg text-gray-200 hover:underline underline-offset-[4px] decoration-[1px] hover:text-white md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                          key={item._id}
                        >
                          <NavLink
                            to={item.link}
                            state={{ data: location.pathname.split("/")[1] }}
                            onClick={() => setSidenav(false)}
                          >
                            {item.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <h1
                        className="flex justify-between text-base cursor-pointer items-center font-titleFont mb-2"
                      >
                        <p onClick={() => handleNavigatePage("/templates")}>Templates{" "}</p>
                        <span onClick={() => setCategory(!category)} className="text-lg">{category ? "-" : "+"}</span>
                      </h1>
                      {category && (
                        <motion.ul
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="text-sm flex flex-col gap-1"
                        >
                          <li onClick={() => handleNavigate(1)} className="headerSedenavLi">Ring</li>
                          <li onClick={() => handleNavigate(2)} className="headerSedenavLi">Band</li>
                          <li onClick={() => handleNavigate(3)} className="headerSedenavLi">Pendant</li>
                        </motion.ul>
                      )}
                    </div>
                    <div className="mt-4">
                      <h1
                        onClick={() => handleNavigatePage("/customization")}
                        className="flex justify-between text-base cursor-pointer items-center font-titleFont mb-2"
                      >
                        Customization
                      </h1>
                    </div>
                  </div>
                  <span
                    onClick={() => setSidenav(false)}
                    className="w-8 h-8 border-[1px] border-gray-300 absolute top-2 -right-10 text-gray-300 text-2xl flex justify-center items-center cursor-pointer hover:border-red-500 hover:text-red-500 duration-300"
                  >
                    <MdClose />
                  </span>
                </motion.div>
              </div>
            )}
          </div>
        </Flex>
      </nav>
    </div>
  );
};

export default Header;
