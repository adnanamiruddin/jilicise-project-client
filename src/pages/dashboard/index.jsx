import { useEffect, useState } from "react";
import roomsApi from "@/api/modules/rooms.api";
import Input from "@/components/layouts/functions/Input";
import LoadingButton from "@/components/layouts/functions/LoadingButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdErrorOutline } from "react-icons/md";
import { toast } from "react-toastify";
import ProtectedPage from "@/components/utils/ProtectedPage";
import { useRouter } from "next/router";
import LonelyCat from "@/components/layouts/globals/LonelyCat";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import Link from "next/link";
import { IoEnterOutline } from "react-icons/io5";

export default function Dashboard() {
  const { user } = useSelector(selectUser);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchUserRoom = async () => {
      const { response } = await roomsApi.getRoomById({
        roomId: user.isOnRoom,
      });
      if (response) setRoom(response);
    };
    if (user && user.isOnRoom) fetchUserRoom();
  }, [user]);

  const joinRoomForm = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Kode pertandingan harus diisi"),
    }),
    onSubmit: async (values) => {
      if (loading) return;
      setLoading(true);
      const { response, error } = await roomsApi.joinRoom(values);
      if (response) {
        joinRoomForm.resetForm();
        toast.success("Berhasil masuk ke pertandingan. Sedang dialihkan...");
        setTimeout(() => {
          router.push(`/room/${response.id}`);
          setLoading(false);
        }, 2000);
      }
      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    },
  });

  return (
    <ProtectedPage>
      <div className="mt-2 md:mx-16 md:mt-10">
        <h1 className="text-2xl font-bold">Beranda Dashboard</h1>

        {room ? (
          <div className="mt-4">
            <div className="mt-5 flex flex-col gap-3 border-2 border-sky-600 bg-sky-100 p-2 rounded-lg cursor-not-allowed">
              <input
                name="code"
                placeholder="Kode ruangan yang ingin dijoin"
                disabled
                className="input w-full disabled:bg-gray-400 disabled:placeholder:text-gray-300 disabled:border-gray-100"
              />
              {/*  */}
              <button className="bg-sky-500 w-full border-0 text-white text-base font-semibold shadow-lg py-2 rounded-md brightness-75">
                Kamu sudah bergabung <br /> ke pertandingan
              </button>
              {/*  */}
              {errorMessage && (
                <div className="flex items-center gap-2 bg-red-100 p-2 rounded-md">
                  <MdErrorOutline />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <h4 className="mt-8 text-xl font-semibold">Sedang bermain di</h4>
            <div className="mt-2 border-sky-400 border-[3px] rounded-lg pt-1">
              <Image
                src="/jili-hand.png"
                alt="Jili"
                width={500}
                height={500}
                className="w-32 mx-auto"
              />
              {/*  */}
              <div className="mt-3 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-600 text-white p-4 rounded-b">
                <h6 className="text-lg font-bold">{room.name}</h6>
                {/*  */}
                <p className="mt-4 text-sm text-justify">{room.description}</p>
                {/*  */}
                <div className="mt-3 flex justify-end">
                  <Link
                    href={`/room/${room.id}`}
                    className="flex items-center bg-sky-500 border-2 border-sky-300 text-white font-medium text-sm px-3 py-1 rounded-md hover:bg-sky-400 hover:border-sky-200 focus:bg-sky-600"
                  >
                    <IoEnterOutline className="mr-2 text-xl" />
                    Masuk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <form
              className="mt-5 flex flex-col gap-3 border-2 border-sky-600 bg-sky-100 p-2 rounded-lg"
              onSubmit={joinRoomForm.handleSubmit}
            >
              <Input
                name="code"
                placeholder="Kode ruangan yang ingin dijoin"
                value={joinRoomForm.values.code}
                onChange={joinRoomForm.handleChange}
                error={
                  joinRoomForm.touched.code &&
                  joinRoomForm.errors.code !== undefined
                }
                helperText={
                  joinRoomForm.touched.code && joinRoomForm.errors.code
                }
              />
              {/*  */}
              <LoadingButton loading={loading}>Masuk</LoadingButton>
              {/*  */}
              {errorMessage && (
                <div className="flex items-center gap-2 bg-red-100 p-2 rounded-md">
                  <MdErrorOutline />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>

            <div className="mt-12 flex flex-col justify-center items-center gap-6">
              <LonelyCat />
              <p className="font-semibold text-lg text-center">
                Kamu sedang tidak berada <br /> di dalam pertandingan
              </p>
            </div>
          </>
        )}
      </div>
    </ProtectedPage>
  );
}
