import Image from "next/image";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

export default function UserRoomItem({ room }) {
  return (
    <div className="bg-white p-3 pe-0 rounded-md border-2 border-sky-300 flex items-start gap-4">
      <Image
        src="/jili-normal.png"
        alt="Jili"
        width={500}
        height={500}
        className="w-16 h-16"
      />

      <div>
        <h1 className="text-lg font-bold">{room.name}</h1>
        <p className="mt-2 text-sm text-gray-500">{room.description}</p>
      </div>

      <div className="ms-auto flex flex-col items-end">
        <Link
          href={`/room/${room.id}`}
          className="-mt-3 btn btn-circle btn-ghost"
        >
          <FiEye className="text-sky-600 text-xl" />
        </Link>
        {/*  */}
        <Link
          href={`/dashboard/admin/edit-room/${room.id}`}
          className="-mt-1 btn btn-circle btn-ghost"
        >
          <FaRegEdit className="text-sky-600 text-xl" />
        </Link>
      </div>
    </div>
  );
}
