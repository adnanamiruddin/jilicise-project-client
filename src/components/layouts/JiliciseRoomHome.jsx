import roomsApi from "@/api/modules/rooms.api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import UserRoomItem from "./UserRoomItem";
import RobotLoading from "./globals/RobotLoading";
import LonelyCat from "./globals/LonelyCat";

export default function JiliciseRoomHome() {
  const [userRooms, setUserRooms] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUserRooms = async () => {
      const { response, error } = await roomsApi.getUserRooms();
      if (response) {
        const sortedResponse = response.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setUserRooms(sortedResponse);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error(error.message);
    };
    fetchUserRooms();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="w-[60%] text-xl font-bold">
          Pertandingan yang Saya Buat
        </h1>

        <div>
          <Link
            href="/dashboard/admin/create-room"
            className="text-sm flex justify-center items-center bg-sky-500 border-2 border-sky-300 font-semibold text-white px-3 py-2 rounded-md hover:bg-sky-400 hover:border-sky-200 focus:bg-sky-600"
          >
            <IoIosAddCircleOutline className="text-xl mr-2" />
            Buat
          </Link>
        </div>
      </div>

      <div className="mt-5">
        {isDataLoaded ? (
          userRooms.length === 0 ? (
            <div className="mt-20 flex flex-col justify-center items-center gap-6">
              <LonelyCat />

              <p className="font-semibold text-lg text-center">
                Kamu belum pernah membuat pertandingan
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {userRooms.map((room) => (
                <UserRoomItem key={room.id} room={room} />
              ))}
            </div>
          )
        ) : (
          <div className="flex justify-center">
            <RobotLoading />
          </div>
        )}
      </div>
    </div>
  );
}
