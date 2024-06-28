import handPosesApi from "@/api/modules/handPoses.api";
import roomsApi from "@/api/modules/rooms.api";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingButton from "@/components/layouts/functions/LoadingButton";
import ChooseHandPoseModal from "@/components/layouts/modals/ChooseHandPoseModal";
import { IoIosAddCircleOutline } from "react-icons/io";
import HandPoseTypeItem from "@/components/layouts/HandPoseTypeItem";
import ProtectedPage from "@/components/utils/ProtectedPage";
import Input from "@/components/layouts/functions/Input";
import TextArea from "@/components/layouts/functions/TextArea";
import { MdErrorOutline } from "react-icons/md";
import GlobalLoading from "@/components/layouts/globals/GlobalLoading";
import { FaPlay } from "react-icons/fa";
import ConfirmStartRoomModal from "@/components/layouts/modals/ConfirmStartRoomModal";
import Image from "next/image";

export default function EditRoom() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [room, setRoom] = useState(null);

  const [handPoses, setHandPoses] = useState([]);
  const [selectedHandPoseTypeList, setSelectedHandPoseTypeList] = useState([]);

  const [existingHandPosesType, setExistingHandPosesType] = useState([]);
  const [existingHandPosesTypeToDeleteId, setExistingHandPosesTypeToDeleteId] =
    useState([]);

  // Fetch room, hand poses data, and existing hand poses data in room
  useEffect(() => {
    const fetchRoom = async () => {
      const { response, error } = await roomsApi.getRoomById({ roomId: id });
      if (response) {
        setRoom(response);
        editRoomForm.setValues({
          name: response.name,
          description: response.description,
          status: response.status,
        });
        fetchExistingHandPoses();
      }
      if (error) toast.error(error.message);
    };

    const fetchExistingHandPoses = async () => {
      const { response, error } = await handPosesApi.getHandPosesByRoomId({
        roomId: id,
      });
      if (response) {
        setExistingHandPosesType(response);
        fetchHandPoses();
      }
      if (error) toast.error(error.message);
    };

    const fetchHandPoses = async () => {
      const { response, error } =
        await handPosesApi.getAllHandPosesGroupByType();
      if (response) {
        setHandPoses(response);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 2000);
      }
      if (error) toast.error(error.message);
    };

    if (id) fetchRoom();
  }, [id]);

  const editRoomForm = useFormik({
    initialValues: {
      name: "",
      description: "",
      status: "",
    },
    onSubmit: async () => {
      if (loading) return;

      setLoading(true);
      let isSuccessfulSave = true;

      if (selectedHandPoseTypeList.length > 0) {
        for (const selectedHandPoseType of selectedHandPoseTypeList) {
          const duration = selectedHandPoseType.duration;
          if (!duration || duration < 60) {
            toast.error("Durasi ronde minimal 60 detik!");
            isSuccessfulSave = false;
            break;
          }
          if (duration > 300) {
            toast.error("Durasi ronde maksimal 300 detik (5 menit)!");
            isSuccessfulSave = false;
            break;
          }
          const { response, error } = await handPosesApi.setHandPose({
            roomId: id,
            duration,
            typeOfHandPoseId: selectedHandPoseType.id,
          });
          if (response) isSuccessfulSave = true;
          if (error) {
            toast.error(error.message);
            isSuccessfulSave = false;
            break;
          }
        }
      }

      if (existingHandPosesTypeToDeleteId.length > 0) {
        for (const existingHandPoseTypeId of existingHandPosesTypeToDeleteId) {
          const { response, error } = await handPosesApi.deleteHandPoseFromRoom(
            {
              roomId: id,
              typeOfHandPoseId: existingHandPoseTypeId,
            }
          );
          if (response) isSuccessfulSave = true;
          if (error) {
            toast.error(error.message);
            isSuccessfulSave = false;
            break;
          }
        }
      }

      if (isSuccessfulSave) {
        if (
          editRoomForm.values.name !== room.name ||
          editRoomForm.values.description !== room.description
        ) {
          const { response, error } = await roomsApi.updateRoom({
            roomId: id,
            name: editRoomForm.values.name,
            description: editRoomForm.values.description,
            status: editRoomForm.values.status,
          });
          if (response) isSuccessfulSave = true;
          if (error) {
            setErrorMessage(updatedRoomError.message);
            setLoading(false);
          }
        }

        toast.success(
          "Hand pose berhasil diperbarui! Halaman akan dimuat ulang..."
        );
        setTimeout(() => {
          router.reload();
          setLoading(false);
        }, 3000);
      } else {
        setLoading(false);
      }
    },
  });

  const handleStartGameButtonClicked = () => {
    if (existingHandPosesType.length < 2) {
      toast.error("Tambahkan minimal 2 ronde pertandingan!");
      return;
    }
    document.getElementById("confirm_start_room_modal").showModal();
  };

  const handleDurationChange = (id, duration) => {
    setSelectedHandPoseTypeList(
      selectedHandPoseTypeList.map((type) => {
        if (type.id === id) {
          return {
            ...type,
            duration,
          };
        }
        return type;
      })
    );
  };

  const handleDeleteSelectedHandPoseType = (index) => {
    setSelectedHandPoseTypeList(
      selectedHandPoseTypeList.filter((_, i) => i !== index)
    );
  };

  const handleDeleteExistingHandPoseType = (existingHandPoseId) => {
    setExistingHandPosesType(
      existingHandPosesType.filter((type) => type.id !== existingHandPoseId)
    );
    setExistingHandPosesTypeToDeleteId([
      ...existingHandPosesTypeToDeleteId,
      existingHandPoseId,
    ]);
  };

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <>
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Edit Pertandingan</h1>
            {/*  */}
            <button
              type="button"
              onClick={handleStartGameButtonClicked}
              className="flex items-center bg-sky-500 border-2 border-sky-300 text-white text-sm px-4 py-2 rounded-md hover:bg-sky-400 hover:border-sky-200 focus:bg-sky-600"
            >
              <FaPlay className="mr-2" />
              Mulai
            </button>
          </div>

          <span className="divider mb-1.5 mt-3"></span>
          <div className="flex justify-center">
            <h2 className="py-3.5 px-10 bg-sky-500 text-white font-semibold text-lg rounded-lg shadow-lg border-[3px] border-sky-300 hover:bg-sky-400 hover:border-sky-100">
              {room.code}
            </h2>
          </div>
          <span className="divider my-1.5"></span>

          <div className="flex justify-center">
            <h4 className="mb-5 border-b-2 border-sky-500 pb-2 px-4 font-bold text-xl uppercase">
              {room.status === "pending"
                ? "Menunggu"
                : room.status === "ongoing"
                ? "Sedang Berlangsung"
                : "Selesai"}
            </h4>
          </div>

          {/* <div className="mt-4">
            <h2>Room Participants</h2>
            {room.roomContestants.map((contestant) => (
              <div key={contestant.id}>
                <h3>{contestant.firstName + " " + contestant.lastName}</h3>
              </div>
            ))}
          </div> */}

          <form
            className="flex flex-col gap-3"
            onSubmit={editRoomForm.handleSubmit}
          >
            <Input
              label="Judul Pertandingan"
              name="name"
              placeholder="Kompetisi Antar Kelas..."
              value={editRoomForm.values.name}
              onChange={editRoomForm.handleChange}
              error={
                editRoomForm.touched.name &&
                editRoomForm.errors.name !== undefined
              }
              helperText={editRoomForm.touched.name && editRoomForm.errors.name}
            />

            <div>
              <div className="label">
                <span className="label-text text-black text-lg -mb-3">
                  Deskripsi Pertandingan
                </span>
              </div>
              <TextArea
                name="description"
                value={editRoomForm.values.description}
                onChange={editRoomForm.handleChange}
                placeholder="Pertandingan klasik antar..."
                rows={5}
              />
            </div>

            <div className="-mt-1">
              <div className="flex justify-between">
                <p className="label label-text font-bold text-black text-xl -mb-3">
                  Pose Tangan
                </p>
                {/*  */}
                {existingHandPosesType.length === 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("choose_hand_pose_modal")
                        .showModal()
                    }
                    className="mt-4 flex items-center bg-sky-500 text-white text-sm px-4 py-2 rounded-md"
                  >
                    <IoIosAddCircleOutline className="mr-2 text-2xl" />
                    Ronde
                  </button>
                ) : null}
              </div>

              {existingHandPosesType.length === 0 &&
              selectedHandPoseTypeList.length === 0 ? (
                <div className="mt-2 flex flex-col justify-center items-center">
                  <Image
                    src="/jili-normal.png"
                    alt="Welcome to Jilicise"
                    width={500}
                    height={500}
                    className="w-56 mx-auto mt-6"
                  />
                  {/*  */}
                  <p className="mt-5 p-4 bg-gradient-to-br from-sky-700 via-sky-500 to-sky-700 text-white font-semibold rounded-lg shadow-lg text-center">
                    Kamu belum menambah ronde pertandingan, klik tombol di atas
                    untuk menambahkannya
                  </p>
                </div>
              ) : null}

              {existingHandPosesType.length > 0 ? (
                <div className="mt-4 flex flex-col gap-4">
                  {existingHandPosesType.map((existingHandPoseType, i) => (
                    <div key={i}>
                      <h4 className="font-semibold text-lg ms-2 mb-0.5">
                        Ronde {i + 1}
                      </h4>
                      <HandPoseTypeItem
                        handPoseType={existingHandPoseType}
                        handleDurationChange={handleDurationChange}
                        onRemoveHandPoseType={() => {
                          handleDeleteExistingHandPoseType(
                            existingHandPoseType.id
                          );
                        }}
                        disableDurationInput
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              {existingHandPosesType.length > 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("choose_hand_pose_modal")
                      .showModal()
                  }
                  className="mt-6 flex items-center bg-sky-500 text-white px-4 py-2 rounded-md"
                >
                  <IoIosAddCircleOutline className="mr-2 text-2xl" />
                  Tambah Ronde Pertandingan
                </button>
              ) : null}
              <div className="mt-4 flex flex-col gap-4 mb-2">
                {selectedHandPoseTypeList.map((selectedHandPoseType, i) => (
                  <HandPoseTypeItem
                    key={i}
                    handPoseType={selectedHandPoseType}
                    handleDurationChange={handleDurationChange}
                    onRemoveHandPoseType={() => {
                      handleDeleteSelectedHandPoseType(i);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="-mt-1">
              <p className="text-sm text-sky-600 font-medium mb-2">
                *Jika sudah yakin, yuk simpan
              </p>
              <LoadingButton loading={loading}>Simpan</LoadingButton>
            </div>

            {errorMessage ? (
              <div className="alert alert-error mt-4 text-white text-sm">
                <MdErrorOutline className="text-3xl" />
                <span>{errorMessage}</span>
              </div>
            ) : null}
          </form>

          <ChooseHandPoseModal
            handPoses={handPoses}
            selectedHandPoseTypeList={selectedHandPoseTypeList}
            setSelectedHandPoseTypeList={setSelectedHandPoseTypeList}
          />
          <ConfirmStartRoomModal roomId={id} />
        </>
      ) : (
        <GlobalLoading />
      )}
    </ProtectedPage>
  );
}
