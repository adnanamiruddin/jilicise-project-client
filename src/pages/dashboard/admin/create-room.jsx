import { useState } from "react";
import roomsApi from "@/api/modules/rooms.api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Input from "@/components/layouts/functions/Input";
import LoadingButton from "@/components/layouts/functions/LoadingButton";
import { MdErrorOutline } from "react-icons/md";
import { useRouter } from "next/router";
import TextArea from "@/components/layouts/functions/TextArea";
import ProtectedPage from "@/components/utils/ProtectedPage";

export default function CreateRoom() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const createRoomForm = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Judul pertandingan harus diisi"),
      description: Yup.string().required("Deskripsi pertandingan harus diisi"),
    }),
    onSubmit: async (values) => {
      if (loading) return;
      setLoading(true);
      const { response, error } = await roomsApi.createRoom(values);
      if (response) {
        createRoomForm.resetForm();
        toast.success("Pertandingan berhasil dibuat");
        router.push(`/dashboard/admin/edit-room/${response.id}`);
      }
      if (error) setErrorMessage(error.message);
      setLoading(false);
    },
  });

  return (
    <ProtectedPage>
      <h1 className="text-2xl font-bold">Buat Pertandingan Klasik</h1>

      <form
        className="mt-2 flex flex-col gap-3"
        onSubmit={createRoomForm.handleSubmit}
      >
        <Input
          label="Judul Pertandingan"
          name="name"
          placeholder="Kompetisi Antar Kelas..."
          value={createRoomForm.values.name}
          onChange={createRoomForm.handleChange}
          error={
            createRoomForm.touched.name &&
            createRoomForm.errors.name !== undefined
          }
          helperText={createRoomForm.touched.name && createRoomForm.errors.name}
        />

        <div>
          <div className="label">
            <span className="label-text text-black text-lg -mb-3">
              Deskripsi Pertandingan
            </span>
          </div>
          <TextArea
            name="description"
            value={createRoomForm.values.description}
            onChange={createRoomForm.handleChange}
            placeholder="Pertandingan klasik antar..."
            rows={5}
          />
        </div>
        <div></div>
        <LoadingButton loading={loading}>Buat</LoadingButton>

        {errorMessage ? (
          <div className="alert alert-error mt-4 text-white text-sm">
            <MdErrorOutline className="text-3xl" />
            <span>{errorMessage}</span>
          </div>
        ) : null}
      </form>
    </ProtectedPage>
  );
}
