import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import usersApi from "@/api/modules/users.api";
import Navbar from "./layouts/globals/Navbar";
import { setUser } from "@/redux/features/userSlice";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/layouts/globals/Footer";
import NotLoggedInModal from "./layouts/modals/NotLoggedInModal";
import BottomNavigation from "./layouts/globals/BottomNavigation";

import "react-toastify/dist/ReactToastify.css";

export default function MainLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isCarouselPassed, setIsCarouselPassed] = useState(false);

  useEffect(() => {
    const authUser = async () => {
      const { response, error } = await usersApi.getProfile();
      if (response) dispatch(setUser(response));
      if (error) dispatch(setUser(null));
    };
    if (localStorage.getItem("actkn")) authUser();
    else dispatch(setUser(null));
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        setIsCarouselPassed(true);
      } else {
        setIsCarouselPassed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Config React Toastify START */}
      <ToastContainer
        position="bottom-left"
        autoClose={4000}
        theme="light"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        limit={1}
      />
      {/* Config React Toastify END */}

      <NotLoggedInModal />

      <Navbar isCarouselPassed={isCarouselPassed} />

      <div
        className={`bg-sky-50 text-black p-6 pt-[4.5rem] min-h-screen ${
          router.pathname.includes("/dashboard") ? "pb-28" : ""
        }`}
      >
        {children}
      </div>

      {router.pathname.includes("/dashboard") ? <BottomNavigation /> : null}

      {!router.pathname.includes("/dashboard") ? <Footer /> : null}
    </>
  );
}
