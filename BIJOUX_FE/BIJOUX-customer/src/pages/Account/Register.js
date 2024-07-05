import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { loginLogo2 } from "../../assets/images";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input';
const nonNameWords = ['admin', 'sale', 'designer', 'production', 'manager']

const Register = () => {
  // ============= Initial State Start here =============
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [checked, setChecked] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [dob, setDob] = useState(null);
  const [fullName, setFullName] = useState(null);

  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [erruserName, setErruserName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  const [errFullName, setErrFullName] = useState("");
  const [errImageUrl, setErrImageUrl] = useState("");
  const [errDob, setErrDob] = useState("");

  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  // ============= Event Handler Start here =============
  const handleUserName = (e) => {
    setUserName(e.target.value);
    setErruserName("");
  };
  const handleFullName = (e) => {
    setFullName(e.target.value);
    setErrFullName("");
  };
  const handleChangeImage = (e) => {
    setImageUrl(e.target.value)
    setErrImageUrl("");
  }
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const handleDob = (e) => {
    setDob(e.target.value);
    setErrDob("");
  }
  const handlePhone = (value) => {
    setPhone(value);
    if (value) {
      const isValid = isValidPhoneNumber(value);
      setIsPhoneNumberValid(isValid);
      if (isValid) {
        setErrPhone("");
      } else {
        setErrPhone("Enter a valid phone number");
      }
    } else {
      setIsPhoneNumberValid(true); // Giả sử giá trị trống là hợp lệ
      setErrPhone("");
    }
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
    setErrAddress("");
  };
  // ============= Event Handler End here ===============
  // ================= Email Validation start here =============
  //Valid có dấu
  const validateSingleWord = (word) => {
    const regex = /^[A-ZÀ-Ý][a-zA-Zà-ýÀ-Ý]*$/;
    return regex.test(word);
  };

  const checkUserName = (username) => {
    if (!username || username.length === 0) {
      return 0; // Trường hợp chuỗi rỗng
    }

    const firstChar = username.charAt(0);

    // Kiểm tra nếu ký tự đầu tiên là chữ cái viết hoa
    if (firstChar.match(/[A-Z]/)) {
      return 2;
    }

    // Kiểm tra nếu ký tự đầu tiên là số hoặc các ký tự đặc biệt
    if (firstChar.match(/[^a-zA-Z]/)) {
      return 3;
    }

    // Kiểm tra nếu chuỗi có dấu cách
    if (username.includes(' ')) {
      return 4;
    }

    // Nếu chuỗi hợp lệ
    return 1;
  };

  const NameValidation = (name) => {
    const nonNameWords = ['admin', 'sale', 'designer', 'production', 'manager'];
    const words = name.split(' ');

    for (const word of words) {
      if (word.trim() === '') continue;

      if (!validateSingleWord(word)) {
        return false;
      }

      if (nonNameWords.includes(word.toLowerCase())) {
        return false;
      }
    }

    return true;
  };



  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };
  // ================= Email Validation End here ===============

  const handleSignUp = async (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error messages
    setErruserName("");
    setErrEmail("");
    setErrImageUrl("");
    setErrDob("");
    setErrFullName("");
    setErrPhone("");
    setErrPassword("");
    setErrAddress("");

    // Validate fields
    if (!userName) {
      setErruserName("Enter your username");
      isValid = false;
    } else {
      const userNameCheck = checkUserName(userName);
      if (userNameCheck === 2) {
        setErruserName("Username cannot start with a capital letter");
        isValid = false;
      }
      if (userNameCheck === 3) {
        setErruserName("Username must start with a letter");
        isValid = false;
      }
      if (userNameCheck === 4) {
        setErruserName("Username cannot contain spaces");
        isValid = false;
      }
    }

    if (!email) {
      setErrEmail("Enter your email");
      isValid = false;
    } else {
      if (!EmailValidation(email)) {
        setErrEmail("Enter a Valid email");
        isValid = false;
      }
    }

    if (!imageUrl) {
      setErrImageUrl("Enter your image");
      isValid = false;
    }

    if (!dob) {
      setErrDob("Enter your date of birth");
      isValid = false;
    }

    if (!fullName) {
      setErrFullName("Enter your full name");
      isValid = false;
    } else {
      if (!NameValidation(fullName)) {
        setErrFullName("Name isn't valid, please Capitalize the first letter and use only alphabets. Real name cannot contains Admin, Sale, Designer, Production, Manager");
        isValid = false;
      }
    }

    if (!phone) {
      setErrPhone("Enter your phone number");
      isValid = false;
    }

    if (!password) {
      setErrPassword("Create a password");
      isValid = false;
    } else {
      if (password.length < 6) {
        setErrPassword("Passwords must be at least 6 characters");
        isValid = false;
      }
    }

    if (!address) {
      setErrAddress("Enter your address");
      isValid = false;
    }

    // Check if all validations pass
    if (isValid) {
      setSuccessMsg(
        `Hello dear ${userName}, Welcome you to BIJOUX Admin panel. We received your Register request. We are processing to validate your access. Till then stay connected and additional assistance will be sent to you by your mail at ${email}`
      );

      // Clear form fields
      setUserName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setAddress("");
      setFullName(""); // Clear fullName as well
      setImageUrl(""); // Clear imageUrl as well
      setDob(""); // Clear dob as well
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={loginLogo2} alt="logoImg" className="w-48" />
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Stay sign in for more
            </h1>
            <p className="text-base">When you sign in, you are with us!</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get started fast with BIJOUX
              </span>
              <br />
              BIJOUX offers bespoke jewelry crafting services with the utmost professionalism and convenience for our esteemed customers.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Access all BIJOUX services
              </span>
              <br />
              Experience our array of jewelry crafting services, including custom designs based on templates or the creation of unique pieces from your own inspirations.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Trusted by online Shoppers
              </span>
              <br />
              Trusted by over 10,000 customers worldwide, BIJOUX stands as a beacon of excellence in the jewelry industry.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Link to="/">
              <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                © BIJOUX
              </p>
            </Link>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {successMsg ? (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/login">
              <button
                className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold 
            tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Log in
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[500px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
                Create your account
              </h1>
              <div className="flex flex-col gap-3">
                {/* client name */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    User Name
                  </p>
                  <input
                    onChange={handleUserName}
                    value={userName}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="eg. bijouxjewelry"
                  />
                  {erruserName && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {erruserName}
                    </p>
                  )}
                </div>
                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Password
                  </p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Create password"
                  />
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>
                {/* Image CHỈNH LẠI GIÚP TAO THÀNH UPFILE */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Image
                  </p>
                  <input
                    onChange={handleChangeImage}
                    value={imageUrl}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide text-base font-medium placeholder:font-normal rounded-md outline-none"
                    type="file"
                    placeholder="Upload your Image"
                  />
                  {errImageUrl && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errImageUrl}
                    </p>
                  )}
                </div>
                {/* Date Of Birth */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Your Birth Date
                  </p>
                  <input
                    onChange={handleDob}
                    value={dob}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="date"
                    placeholder="Enter Your BirthDay"
                  />
                  {errDob && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errDob}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Work Email
                  </p>
                  <input
                    onChange={handleEmail}
                    value={email}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="email"
                    placeholder="john@workemail.com"
                  />
                  {errEmail && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errEmail}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Full Name
                  </p>
                  <input
                    onChange={handleFullName}
                    value={fullName}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="eg. John Doe"
                  />
                  {errFullName && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errFullName}
                    </p>
                  )}
                </div>
                {/* Phone Number */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Phone Number
                  </p>
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={handlePhone} />

                  {errPhone && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPhone}
                    </p>
                  )}

                </div>
                {/* Address */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Address
                  </p>
                  <input
                    onChange={handleAddress}
                    value={address}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="road-001, house-115, example area"
                  />
                  {errAddress && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errAddress}
                    </p>
                  )}
                </div>
                <div className="flex items-start mdl:items-center gap-2">
                  <input
                    onChange={() => setChecked(!checked)}
                    className="w-4 h-4 mt-1 mdl:mt-0 cursor-pointer"
                    type="checkbox"
                  />
                  <p className="text-sm text-primeColor">
                    I agree to the BIJOUX{" "}
                    <span className="text-blue-500">Terms of Service </span>and{" "}
                    <span className="text-blue-500">Privacy Policy</span>.
                  </p>
                </div>
                <button
                  onClick={handleSignUp}
                  className={`${checked
                    ? "bg-primeColor hover:bg-black hover:text-white cursor-pointer"
                    : "bg-gray-500 hover:bg-gray-500 hover:text-gray-200 cursor-none"
                    } w-full text-gray-200 text-base font-medium h-10 rounded-md hover:text-white duration-300`}
                >
                  Create Account
                </button>
                <p className="text-sm text-center font-titleFont font-medium">
                  Already have an Account?{" "}
                  <Link to="/login">
                    <span className="hover:text-blue-600 duration-300">
                      Log in
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
