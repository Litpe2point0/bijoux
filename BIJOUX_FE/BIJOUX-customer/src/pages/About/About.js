import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { CgInstagram } from "react-icons/cg";
import './style.css'
const About = () => {
  // const location = useLocation();
  // const [prevLocation, setPrevLocation] = useState("");
  // useEffect(() => {
  //   setPrevLocation(location.state.data);
  // }, [location]);
  return (
    <div className="w-full flex flex-col items-center text-[#151542] p-5">
      <p className="font-loraFont text-4xl">Welcome to BIJOUX</p>
      <div className="flex flex-col gap-5 text-[#151542] w-full font-gantariFont py-5 px-16">
        <p>
          Welcome to Bijoux, your premier destination for custom jewelry. Established in 2024, Bijoux was born out of a passion for creating unique and personalized jewelry pieces that reflect the individuality and style of each of our clients.
        </p>
        <p>
          At Bijoux, we believe that jewelry is more than just an accessory; it is a form of self-expression, a way to commemorate life's special moments, and a cherished keepsake that can be passed down through generations. Our mission is to craft exquisite, custom-made jewelry that tells your story and captures your unique essence.
        </p>
        <p>
          Our talented team of designers and artisans are dedicated to excellence in craftsmanship and innovation. Using only the finest materials, we work closely with you to bring your vision to life, whether it's a bespoke engagement ring, a one-of-a-kind necklace, or a custom bracelet. Each piece is meticulously designed and crafted to ensure it meets our high standards of quality and beauty.
        </p>
        <p>
          We are committed to providing a personalized and memorable experience for every client. From the initial consultation to the final reveal, we take pride in our collaborative approach, ensuring that every detail is perfect and that you are completely satisfied with your custom jewelry piece.
        </p>
        <p>
          Thank you for choosing Bijoux. We look forward to helping you create timeless treasures that you will cherish forever.
        </p>
        <p className="font-loraFont text-xl">
          Bijoux - Your Story, Our Craft.
        </p>
      </div>
      <p className="font-loraFont text-4xl">
        Our Social Media
      </p>
      <div className="w-full flex items-center justify-around mt-7">
        <FaFacebook className="text-blue-600" size={50} />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Instagram--Streamline-Core-Gradient" height="45" width="45" stroke-width="1"><desc>Instagram Streamline Icon: https://streamlinehq.com</desc><g id="Free Gradient/Computer Devices/instagram"><path id="Subtract" fill="url(#paint0_linear_14402_13045)" fill-rule="evenodd" d="M3.57144.5C1.87513.5.5 1.87512.5 3.57143v6.85717C.5 12.1249 1.87514 13.5 3.57144 13.5h6.85716c1.6963 0 3.0715-1.3751 3.0715-3.0714V3.57143C13.5001 1.87512 12.1249.5 10.4286.5H3.57144ZM10.46 4.15613c-.4143 0-.75004-.33579-.75004-.75 0-.41422.33574-.75.75004-.75.4142 0 .75.33578.75.75 0 .41421-.3358.75-.75.75Zm-3.46023.04431c-1.54616 0-2.79957 1.25341-2.79957 2.79957 0 1.54617 1.25341 2.79958 2.79957 2.79958 1.54616 0 2.79958-1.25341 2.79958-2.79958 0-1.54616-1.25342-2.79957-2.79958-2.79957Z" clip-rule="evenodd"></path></g><defs><linearGradient id="paint0_linear_14402_13045" x1="14.627" x2="-2.908" y1="16.253" y2="3.797" gradientUnits="userSpaceOnUse"><stop stop-color="#FFD600"></stop><stop offset="1" stop-color="#FF007A"></stop></linearGradient></defs></svg>
        <FaSquareXTwitter className="text-black" size={50} />
        <FaYoutube className="text-red-600" size={50} />
      </div>
    </div>
  );
};

export default About;
