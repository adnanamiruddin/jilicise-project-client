import { IoHome } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { FaAngellist } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";

export default function BottomNavigation() {
  const router = useRouter();

  return (
    <div className="fixed z-50 w-full h-[4.5rem] max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-sky-500 group"
        >
          <IoHome
            className={`text-2xl text-gray-700 group-hover:text-sky-100 mb-0.5 ${
              router.pathname === "/dashboard" ? "text-sky-600" : ""
            }`}
          />
          <p
            className={`text-sm font-medium group-hover:text-sky-50 ${
              router.pathname === "/dashboard" ? "text-sky-600" : ""
            }`}
          >
            Beranda
          </p>
        </Link>

        <Link
          href="/dashboard/admin"
          className="flex flex-col items-center justify-center px-5 hover:bg-sky-500 group"
        >
          <FaAngellist
            className={`text-2xl text-gray-700 group-hover:text-sky-100 mb-0.5 ${
              router.pathname === "/dashboard/admin" ? "text-sky-600" : ""
            }`}
          />
          <p
            className={`text-sm font-medium group-hover:text-sky-50 ${
              router.pathname === "/dashboard/admin" ? "text-sky-600" : ""
            }`}
          >
            Jilicise
          </p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-sky-500 group"
        >
          <MdAccountCircle
            className={`text-2xl text-gray-700 group-hover:text-sky-100 mb-0.5 ${
              router.pathname === "/dashboard/profile" ? "text-sky-600" : ""
            }`}
          />
          <p
            className={`text-sm font-medium group-hover:text-sky-50 ${
              router.pathname === "/dashboard/profile" ? "text-sky-600" : ""
            }`}
          >
            Profil
          </p>
        </Link>
      </div>
    </div>
  );
}
