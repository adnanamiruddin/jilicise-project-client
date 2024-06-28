import roomsApi from "@/api/modules/rooms.api";
import { selectUser } from "@/redux/features/userSlice";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StartedRoom from "@/components/layouts/StartedRoom";
import Link from "next/link";
import ProtectedPage from "@/components/utils/ProtectedPage";
import GlobalLoading from "@/components/layouts/globals/GlobalLoading";
import NotFound from "@/components/layouts/globals/NotFound";
import { IoIosCamera } from "react-icons/io";
import LonelyCat from "@/components/layouts/globals/LonelyCat";
import RoomContestantItem from "@/components/layouts/RoomContestantItem";
import { FaRegEdit } from "react-icons/fa";

export default function Room() {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useSelector(selectUser);

  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const { response, error } = await roomsApi.getRoomById({ roomId: id });
      if (response) {
        setRoom(response);
        startRoomForm.setFieldValue("roomId", id);
        startRoomForm.setFieldValue("name", response.name);
        startRoomForm.setFieldValue("description", response.description);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) {
        setTimeout(() => {
          toast.error(error.message);
          setIsDataLoaded(true);
        }, 3000);
      }
    };

    if (id) fetchRoom();
  }, [id]);

  const startRoomForm = useFormik({
    initialValues: {
      roomId: "",
      name: "",
      description: "",
      status: "ongoing",
    },
    onSubmit: async (values) => {
      if (loading) return;
      setLoading(true);
      const { response, error } = await roomsApi.updateRoom(values);
      if (response) {
        startRoomForm.resetForm();
        toast.success("Permainan dimulai");
        router.push("/dashboard");
      }
      if (error) toast.error(error.message);
      setLoading(false);
    },
  });

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        room ? (
          room.status === "ongoing" ? (
            <StartedRoom id={id} />
          ) : (
            <>
              <div className="mt-2 flex justify-between">
                <h1 className="w-1/2 text-2xl font-bold">
                  Pertandingan Klasik
                </h1>
                {/*  */}
                <div>
                  <Link
                    href={`/room/${id}/test`}
                    className="flex items-center bg-sky-500 border-2 border-sky-300 text-white font-medium text-sm px-4 py-2 rounded-md hover:bg-sky-400 hover:border-sky-200 focus:bg-sky-600"
                  >
                    <IoIosCamera className="mr-2 text-2xl" />
                    Tes Kamera
                  </Link>
                </div>
              </div>

              <span className="divider mb-3"></span>
              <h2 className="text-center font-black text-3xl">{room.name}</h2>

              <span className="divider my-1.5"></span>
              <div className="flex justify-center">
                <h3 className="py-3.5 px-10 bg-sky-500 text-white font-semibold text-lg rounded-lg shadow-lg border-[3px] border-sky-500 hover:bg-sky-600 hover:border-sky-100">
                  {room.code}
                </h3>
              </div>
              <span className="divider my-1.5"></span>

              <div className="flex justify-center">
                <h4 className="mb-5 border-b-2 border-sky-500 pb-2 px-4 font-bold text-xl">
                  MENUNGGU
                </h4>
              </div>

              {room.roomContestants.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {room.roomContestants.map((contestant, i) => (
                    <RoomContestantItem key={i} contestant={contestant} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-6">
                  <LonelyCat />
                  <p className="font-semibold text-lg text-center">
                    Belum ada peserta <br /> pertandingan
                  </p>
                </div>
              )}

              {user && user.id === room.roomMasterId ? (
                <Link
                  href={`/dashboard/admin/edit-room/${id}`}
                  className="mt-8 flex justify-center items-center bg-sky-500 border-2 border-sky-300 text-white font-medium text-lg py-3 rounded-lg hover:bg-sky-400 hover:border-sky-200 focus:bg-sky-600"
                >
                  <FaRegEdit className="mr-3 text-3xl" />
                  Edit Pertandingan
                </Link>
              ) : null}
            </>
          )
        ) : (
          <NotFound />
        )
      ) : (
        <GlobalLoading />
      )}
    </ProtectedPage>
  );
}
