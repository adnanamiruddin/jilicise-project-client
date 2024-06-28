import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";

export default function HomePage() {
  const { user } = useSelector(selectUser);

  return (
    <div className="-mt-8 -mx-6 overflow-x-hidden md:-mt-0">
      {/* Mobile View START */}
      <div className="md:hidden bg-gradient-to-b from-sky-500 to-sky-50 w-full min-h-screen flex flex-col justify-center items-center pt-4">
        <h1 className="-mt-8 text-2xl font-bold font-serif text-sky-50 bg-sky-500 shadow-xl w-max py-4 px-6 rounded-lg mx-auto hover:brightness-105 hover:shadow-sky-700">
          Hai, Selamat Datang
        </h1>

        <Image
          src="/jili-welcome.png"
          alt="Welcome to Jilicise"
          width={500}
          height={500}
          className="w-full mx-auto mt-6"
        />
        <div className="flex justify-center">
          <div class="ballLoader">
            <p class="ballText">JILICISE</p>
          </div>
        </div>
      </div>
      {/* Mobile View END */}

      {/* Desktop View START */}
      <div className="hidden md:flex bg-gradient-to-b from-sky-500 from-20% to-sky-50 w-full min-h-screen justify-center items-center gap-36 -mt-12">
        <div>
          <h1 className="text-3xl font-bold font-serif text-sky-50 bg-sky-500 shadow-xl w-max py-4 px-6 rounded-lg mx-auto hover:brightness-105 hover:shadow-sky-700">
            Hai, Selamat Datang di Jilicise
          </h1>
        </div>

        <div>
          <Image
            src="/jili-welcome.png"
            alt="Welcome to Jilicise"
            width={500}
            height={500}
            className="w-full mx-auto mt-6"
          />
          <div className="flex justify-center">
            <div class="ballLoader">
              <p class="ballText">JILICISE</p>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop View END */}

      <div className="mt-8 mx-6 pb-12">
        <h1 className="font-serif mb-5 font-bold text-2xl text-center leading-normal md:text-3xl">
          Yuk {!user ? "Mulai" : "Lanjutkan"} <br className="md:hidden" />
          Petualanganmu!
        </h1>

        <div className="flex flex-col gap-6 md:flex-row md:justify-center md:gap-6 md:mt-8">
          {!user ? (
            <>
              <Link href="/register" className="md:w-[40%]">
                <div className="font-mono p-4 bg-gradient-to-br from-sky-800 to-sky-600 border-2 border-b-[7px] border-sky-800 text-white rounded-lg shadow-lg hover:brightness-110">
                  <h3 className="font-semibold text-xl">Register</h3>
                  <p className="mt-3 flex items-center">
                    Buat akun dan bermain bersama teman
                    <IoIosArrowForward className="ms-2 text-2xl" />
                  </p>
                </div>
              </Link>

              <Link href="/login" className="md:w-[40%]">
                <div className="font-mono p-4 bg-gradient-to-br from-gray-200 to-gray-50 border-2 border-gray-200 border-b-[7px] border-b-gray-400 text-black rounded-lg shadow-lg hover:brightness-110">
                  <h3 className="font-bold text-xl">Login</h3>
                  <p className="mt-3 flex items-center">
                    Masuk ke akunmu dan mulai bermain
                    <IoIosArrowForward className="ms-2 text-2xl" />
                  </p>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/join" className="md:w-[40%]">
                <div className="font-mono p-4 bg-gradient-to-br from-sky-800 to-sky-600 border-2 border-b-[7px] border-sky-800 text-white rounded-lg shadow-lg hover:brightness-110">
                  <h3 className="font-semibold text-xl">Bermain</h3>
                  <p className="mt-3 flex items-center">
                    Masuk ke pertandingan dan mulai bermain
                    <IoIosArrowForward className="ms-2 text-2xl" />
                  </p>
                </div>
              </Link>

              <Link href="/dashboard" className="md:w-[40%]">
                <div className="font-mono p-4 bg-gradient-to-br from-gray-200 to-gray-50 border-2 border-gray-200 border-b-[7px] border-b-gray-400 text-black rounded-lg shadow-lg hover:brightness-110">
                  <h3 className="font-bold text-xl">Dashboard</h3>
                  <p className="mt-3 flex items-center">
                    Masuk ke dashboard dan buat pertandingan
                    <IoIosArrowForward className="ms-2 text-2xl" />
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>

        <Image
          src="/jili-normal.png"
          alt="Welcome to Jilicise"
          width={500}
          height={500}
          className="w-full mx-auto mt-12 md:w-1/3 md:mt-20"
        />
      </div>
    </div>
  );
}
