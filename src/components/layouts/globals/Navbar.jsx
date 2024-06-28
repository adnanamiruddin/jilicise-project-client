import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "@/redux/features/userSlice";
import { toast } from "react-toastify";
import { auth } from "@/api/config/firebase.config";
import { FaHome, FaRegAddressBook } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { MdAccountCircle, MdOutlineDashboard } from "react-icons/md";

const generalLinks = [
  {
    href: "/",
    label: "Beranda",
    icon: <FaHome className="text-2xl me-1" />,
  },
];

const notLoggedInLinks = [
  {
    href: "/login",
    label: "Login",
    icon: <FiLogIn className="text-2xl me-1" />,
  },
  {
    href: "/register",
    label: "Register",
    icon: <FaRegAddressBook className="text-2xl me-1" />,
  },
];

const loggedInLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <MdOutlineDashboard className="text-2xl me-1" />,
  },
];

export default function Navbar({ isCarouselPassed }) {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(setUser(null));
      toast.info("Bye bye 👋");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Mobile View START */}
      <div className="md:hidden navbar fixed z-[999] transition-all ease-in duration-300 bg-gradient-to-br from-sky-400 to-sky-600 py-3">
        <Link
          href="/"
          className="font-serif text-3xl text-white font-bold ms-3 italic"
        >
          Jilicise
        </Link>

        <div className="ms-auto me-1">
          {!user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn font-bold text-lg shadow-lg border-2 px-4 text-white bg-sky-500 border-sky-300 hover:bg-sky-400 hover:border-sky-100 focus:bg-sky-600 focus:border-b-0 focus:rounded-b-none"
              >
                Login
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow-lg rounded-box w-52 bg-gradient-to-bl from-sky-600 to-sky-400 border-sky-300 border-2 border-t-0 border-r-0 rounded-tr-none"
              >
                {notLoggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white text-base font-semibold hover:bg-sky-400 focus:bg-sky-600"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn font-bold text-lg shadow-lg border-2 p-2 text-white bg-sky-500 border-sky-300 hover:bg-sky-400 hover:border-sky-100 focus:bg-sky-600 focus:border-b-0 focus:rounded-b-none"
              >
                <MdAccountCircle className="text-2xl" />
                {user.firstName}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow-lg rounded-box w-52 bg-gradient-to-bl from-sky-600 to-sky-400 border-sky-300 border-2 border-t-0 border-r-0 rounded-tr-none"
              >
                {loggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white text-base font-semibold hover:bg-sky-400 focus:bg-sky-600"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white text-base font-semibold mt-2 bg-red-600 hover:bg-red-500 focus:bg-red-700"
                  >
                    <FiLogOut className="text-2xl me-1" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Mobile View END */}

      {/* Tab - Desktop View START */}
      <div className="hidden md:navbar fixed z-[999] transition-all ease-in-out duration-300 bg-gradient-to-br from-sky-600 to-sky-500">
        <div className="navbar-start">
          <h1 className="font-serif text-3xl text-white font-bold ms-4 mb-0.5 italic">
            Jilicise
          </h1>

          <ul className="ms-4 menu menu-horizontal gap-2 text-base font-semibold">
            {generalLinks.map((link) => (
              <li
                key={link.href}
                className={`rounded-md border-2 border-transparent hover:bg-sky-600 hover:border-sky-400 focus:bg-sky-400 ${
                  router.pathname === link.href
                    ? "bg-sky-500 border-sky-300 shadow-2xl"
                    : ""
                }`}
              >
                <Link href={link.href} className="text-white focus:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end me-2">
          {!user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn font-bold text-lg shadow-lg border-2 px-4 text-white bg-sky-600 border-sky-400 hover:bg-sky-500 hover:border-sky-200 focus:bg-sky-700 focus:border-b-0 focus:rounded-b-none"
              >
                Login
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-gradient-to-bl from-sky-700 to-sky-500 border-sky-300 border-2 border-t-0 border-r-0 rounded-tr-none"
              >
                {notLoggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white font-semibold hover:bg-sky-300"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn font-bold text-lg shadow-lg border-2 px-4 text-white bg-sky-600 border-sky-400 hover:bg-sky-500 hover:border-sky-200 focus:bg-sky-700 focus:border-b-0 focus:rounded-b-none"
              >
                <MdAccountCircle className="text-2xl" />
                {user.firstName}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-gradient-to-bl from-sky-700 to-sky-500 border-sky-300 border-2 border-t-0 border-r-0 rounded-tr-none"
              >
                <>
                  {loggedInLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-white font-semibold hover:bg-sky-300"
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </>

                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white font-semibold mt-2 bg-red-600 hover:bg-red-500 focus:bg-red-700"
                  >
                    <FiLogOut className="text-2xl me-1" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* <div
        className={`hidden md:navbar fixed z-[999] transition-all ease-in-out duration-300 ${
          isCarouselPassed || router.asPath !== "/"
            ? "bg-gradient-to-br from-sky-400 to-sky-700"
            : "bg-transparent"
        }`}
      >
        <div className="navbar-start">
          <h1 className="text-3xl text-white font-bold ms-4 mb-0.5 italic">
            Jelaya
          </h1>
        </div>

        <div
          className={`navbar-center flex transition-all delay-500 ${
            router.pathname === "/blogs" ? "ms-24" : ""
          }`}
        >
          <ul className="menu menu-horizontal px-1 gap-2 text-lg font-semibold">
            {generalLinks.map((link) => (
              <li
                key={link.href}
                className={`rounded-md border-2 border-transparent hover:bg-sky-500 hover:border-sky-300 focus:bg-sky-300 ${
                  router.pathname === link.href
                    ? "bg-sky-400 border-sky-200"
                    : ""
                }`}
              >
                <Link href={link.href} className="text-white focus:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end me-2">
          {!user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className={`btn text-white font-bold text-lg shadow-lg border-2 py-2 px-4 hover:bg-sky-600 hover:border-sky-100 ${
                  isCarouselPassed || router.asPath !== "/"
                    ? "bg-sky-500 border-sky-300"
                    : "bg-transparent border-transparent"
                }`}
              >
                Masuk
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-sky-500"
              >
                {notLoggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white font-semibold hover:bg-sky-300"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className={`btn text-white font-bold text-lg shadow-lg border-2 p-2 hover:bg-sky-600 hover:border-sky-100 ${
                  isCarouselPassed || router.asPath !== "/"
                    ? "bg-sky-500 border-sky-300"
                    : "bg-transparent border-transparent"
                }`}
              >
                <MdAccountCircle className="text-2xl" />
                {user.firstName}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-sky-500"
              >
                {loggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white font-semibold hover:bg-sky-300"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white font-semibold mt-2 bg-red-600 hover:bg-red-500 focus:bg-red-700"
                  >
                    <FiLogOut className="text-2xl me-1" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div> */}
      {/* Tab - Desktop View END */}
    </>
  );
}
