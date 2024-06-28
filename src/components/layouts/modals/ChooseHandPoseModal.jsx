import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ChooseHandPoseModal({
  handPoses,
  selectedHandPoseTypeList,
  setSelectedHandPoseTypeList,
}) {
  const [selectedHandPoseType, setSelectedHandPoseType] = useState({
    id: "",
    name: "",
    handPoses: [],
  });

  const handleAddHandPoseClicked = () => {
    // Check if the selected hand pose type already exists
    const isHandPoseTypeExists = selectedHandPoseTypeList.some(
      (handPoseType) => handPoseType.id === selectedHandPoseType.id
    );
    if (isHandPoseTypeExists) {
      document.getElementById("choose_hand_pose_modal").close();
      toast.error(
        "Tipe pose tangan sudah ada. Silahkan simpan terlebih dahulu 😁"
      );
      return;
    }

    setSelectedHandPoseTypeList((prevState) => [
      ...prevState,
      selectedHandPoseType,
    ]);
    document.getElementById("choose_hand_pose_modal").close();
  };

  return (
    <dialog id="choose_hand_pose_modal" className="modal">
      <div className="modal-box bg-gray-100">
        <h1 className="shine">Jilicise</h1>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div className="mt-8">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {handPoses.map((handPose) => (
              <button
                key={handPose.id}
                type="button"
                className={`bg-white p-4 pt-2 w-full rounded-lg border-2 ${
                  selectedHandPoseType.id === handPose.id
                    ? "border-blue-400"
                    : " border-white"
                }`}
                onClick={() =>
                  setSelectedHandPoseType({
                    id: handPose.id,
                    name: handPose.name,
                    handPoses: handPose.handPoses,
                  })
                }
              >
                <h4 className="text-start text-lg font-bold">
                  {handPose.name}
                </h4>
                <div className="flex items-center gap-4 flex-wrap mt-2">
                  {handPose.handPoses.map((pose) => (
                    <div
                      key={pose.id}
                      className="border-2 border-teal-400 rounded-lg"
                    >
                      <Image
                        src={pose.imageURL}
                        alt={pose.name}
                        width={500}
                        height={500}
                        className="w-28 h-20 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddHandPoseClicked}
          type="button"
          className="mt-6 btn bg-sky-500 w-full border-0 text-white text-lg hover:bg-sky-700"
        >
          Tambah
        </button>
      </div>
    </dialog>
  );
}
