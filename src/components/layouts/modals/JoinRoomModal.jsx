import Link from "next/link";

export default function JoinRoomModal() {
  return (
    <dialog id="join_room_modal" className="modal">
      <div className="modal-box bg-gray-100">
        <h1 className="shine">Jilicise</h1>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div className="flex justify-center items-center gap-3 mt-4">
          <Link
            href="/dashboard/admin/create-room"
            className="w-[49%] btn bg-sky-500 text-white border-sky-200 text-lg hover:bg-sky-400 hover:border-sky-100"
          >
            Buat
          </Link>
          <Link
            href="/join"
            className="w-[49%] btn bg-sky-500 text-white border-sky-200 text-lg hover:bg-sky-400 hover:border-sky-100"
          >
            Masuk
          </Link>
        </div>
      </div>
    </dialog>
  );
}
