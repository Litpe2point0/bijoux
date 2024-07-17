import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  Routes,
  ScrollRestoration,
} from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import Register from "./pages/Account/Register";
import Cart from "./pages/Cart/Cart";
//import ViewDesignProcess from "./pages/Cart/ViewDesignProcess";
import ViewOrder from "./pages/Cart/ViewOrder";
import ViewPricedQuote from "./pages/Cart/ViewPricedQuote";
import ViewQuote from "./pages/Cart/ViewQuote";
import PaymentHistory from "./pages/Cart/Payment";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import Template from "./pages/Services/Template";
import Journal from "./pages/Journal/Journal";
import Offer from "./pages/Offer/Offer";
import Payment from "./pages/payment/Payment";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shop from "./pages/Shop/Shop";
import { ToastContainer } from "react-toastify";
import MountingDetail from "./pages/Services/TemplateStep/MountingDetail";
import Profile from "./pages/Profile/profile";
import PricedQuoteDetails from "./pages/Cart/PricedQuoteDetails";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Account/Login";
import OrderDetails from "./pages/Cart/OrderDetails";
import SelectType from "./pages/Services/SelectType";
import CustomizationForm from "./pages/Services/CustomizationForm";

const Layout = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <FooterBottom />
    </div>
  );
};
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        {/* ==================== Header Navlink Start here =================== */}
        <Route index element={<Home />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/services" element={<Services />}></Route>
        <Route path="/template" element={<Template />}></Route>
        <Route path="/mounting-detail/:id" element={<MountingDetail />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/journal" element={<Journal />}></Route>
        <Route path="/select-type" element={<SelectType />}></Route>
        <Route path="/customization-form" element={<CustomizationForm />}></Route>
        {/* ==================== Header Navlink End here ===================== */}
        <Route path="/category/:category" element={<Offer />}></Route>
        <Route path="/product/_:id" element={<ProductDetails />}></Route>
        <Route path="cart/*" element={<Cart />}>
          <Route path="quote" element={<ViewQuote />} />
          <Route path="order" element={<ViewOrder />} />
          <Route path="order-detail/:id" element={<OrderDetails />} />
          <Route path="payment" element={<PaymentHistory />} />
        </Route>
        <Route path="/paymentgateway" element={<Payment />}></Route>
      </Route>
      {/* <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route> */}
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>

    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
