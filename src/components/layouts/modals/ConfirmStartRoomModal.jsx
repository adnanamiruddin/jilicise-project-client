import roomsApi from "@/api/modules/rooms.api";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaQuestion } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ConfirmStartRoomModal({ roomId }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleStartGame = async () => {
    setLoading(true);
    const { response, error } = await roomsApi.startRoom({ roomId });
    if (response) {
      document.getElementById("confirm_start_room_modal").close();
      toast.success("Pertandingan dimulai!");
      setTimeout(() => {
        // router.push(`/room/${roomId}`);
        router.reload();
        setLoading(false);
      }, 3000);
    }
    if (error) {
      document.getElementById("confirm_start_room_modal").close();
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <dialog id="confirm_start_room_modal" className="modal">
      <div className="modal-box bg-white">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <FaQuestion className="text-center w-full text-6xl text-sky-500" />

        <h4 className="mt-4 text-center text-lg">
          Apakah pertandingan ini betul betul betul sudah siap untuk dimulai?
        </h4>

        <div className="mt-4 flex justify-center items-center gap-5">
          <form method="dialog" className="w-1/3">
            <button className="w-full py-2.5 text-gray-900 font-medium text-center bg-gray-100 border-gray-300 hover:bg-white rounded-lg border">
              {!loading ? (
                "Tidak"
              ) : (
                <span className="loading loading-bars loading-md"></span>
              )}
            </button>
          </form>

          <button
            onClick={handleStartGame}
            disabled={loading}
            className={`w-1/3 py-2.5 text-white font-medium text-center bg-sky-600 border-sky-400 hover:bg-sky-400 rounded-lg border ${
              loading ? "brightness-75" : ""
            }`}
          >
            {!loading ? (
              "Ya, mulai"
            ) : (
              <span className="loading loading-bars loading-md"></span>
            )}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
