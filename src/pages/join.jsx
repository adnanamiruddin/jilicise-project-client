import roomsApi from "@/api/modules/rooms.api";
import Input from "@/components/layouts/functions/Input";
import LoadingButton from "@/components/layouts/functions/LoadingButton";
import ProtectedPage from "@/components/utils/ProtectedPage";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function Join() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

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
      <div className="min-h-screen -mx-6 -mt-2 bg-gradient-to-b from-sky-500 to-sky-300 overflow-x-hidden">
        <div className="px-6 pt-[10%]">
          <Image
            src="/jili-welcome.png"
            alt="Welcome to Jilicise"
            width={500}
            height={500}
            className="w-72 mx-auto"
          />

          <div className="flex justify-center">
            <div class="ballLoader">
              <p class="ballText">JILICISE</p>
            </div>
          </div>

          <form
            onSubmit={joinRoomForm.handleSubmit}
            className="mt-4 flex flex-col gap-4 px-4 py-6 bg-sky-400 border-8 border-sky-300 rounded-lg shadow-lg"
          >
            <Input
              name="code"
              placeholder="Kode pertandingan"
              type="text"
              value={joinRoomForm.values.code}
              onChange={joinRoomForm.handleChange}
              error={
                joinRoomForm.touched.code &&
                joinRoomForm.errors.code !== undefined
              }
              helperText={joinRoomForm.touched.code && joinRoomForm.errors.code}
            />

            <LoadingButton loading={loading}>Masuk</LoadingButton>

            {errorMessage ? (
              <div className="alert alert-error mt-2 text-white text-sm font-semibold">
                <MdErrorOutline className="text-3xl" />
                <span>{errorMessage}</span>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </ProtectedPage>
  );
}
