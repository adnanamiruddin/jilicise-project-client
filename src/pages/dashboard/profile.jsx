import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/components/layouts/functions/Input";
import LoadingButton from "@/components/layouts/functions/LoadingButton";
import userApi from "@/api/modules/users.api";
import { selectUser, setUser } from "@/redux/features/userSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { MdErrorOutline } from "react-icons/md";
import ProtectedPage from "@/components/utils/ProtectedPage";
import GlobalLoading from "@/components/layouts/globals/GlobalLoading";
import Image from "next/image";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector(selectUser);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        profileForm.setValues(user);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
    };
    fetchUserProfile();
  }, [user]);

  const profileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      age: "",
      city: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Nama depan harus diisi"),
      lastName: Yup.string().required("Nama belakang harus diisi"),
      age: Yup.number().required("Umur harus diisi"),
      city: Yup.string().required("Kota harus diisi"),
    }),
    onSubmit: async (values) => {
      if (loading) return;
      setLoading(true);
      const { response, error } = await userApi.updateProfile(values);
      setLoading(false);
      if (response) {
        profileForm.resetForm();
        dispatch(setUser(response));
        toast.success("Profil berhasil diperbarui");
        router.reload();
      }
      if (error) setErrorMessage(error.message);
    },
  });

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <div className="flex justify-center items-center mt-2 md:mx-64">
          <div className="w-full md:p-24 md:rounded-md md:bg-gray-100 md:border-2 md:border-gray-300 md:shadow-lg">
            <h3 className="text-2xl font-bold">Profil Saya</h3>

            <Image
              src={user.avatarURL}
              alt={user.firstName}
              width={500}
              height={500}
              className="w-[55%] mx-auto my-6"
            />

            <form
              className="flex flex-col gap-1"
              onSubmit={profileForm.handleSubmit}
            >
              <div className="flex gap-2 w-full">
                <Input
                  label="Nama Depan"
                  name="firstName"
                  placeholder="Nama Depan"
                  type="text"
                  value={profileForm.values.firstName}
                  onChange={profileForm.handleChange}
                  error={
                    profileForm.touched.firstName &&
                    profileForm.errors.firstName !== undefined
                  }
                  helperText={
                    profileForm.touched.firstName &&
                    profileForm.errors.firstName
                  }
                />
                <Input
                  label="Nama Belakang"
                  name="lastName"
                  placeholder="Nama Belakang"
                  type="text"
                  value={profileForm.values.lastName}
                  onChange={profileForm.handleChange}
                  error={
                    profileForm.touched.lastName &&
                    profileForm.errors.lastName !== undefined
                  }
                  helperText={
                    profileForm.touched.lastName && profileForm.errors.lastName
                  }
                />
              </div>

              <Input
                label="Umur"
                name="age"
                placeholder="18"
                type="number"
                value={profileForm.values.age}
                onChange={profileForm.handleChange}
                error={
                  profileForm.touched.age &&
                  profileForm.errors.age !== undefined
                }
                helperText={profileForm.touched.age && profileForm.errors.age}
              />
              <Input
                label="Asal Kota"
                name="city"
                placeholder="Makassar"
                type="text"
                value={profileForm.values.city}
                onChange={profileForm.handleChange}
                error={
                  profileForm.touched.city &&
                  profileForm.errors.city !== undefined
                }
                helperText={profileForm.touched.city && profileForm.errors.city}
              />

              <div className="w-full mt-4">
                <LoadingButton loading={loading}>Simpan</LoadingButton>
              </div>

              {errorMessage ? (
                <div className="alert alert-error mt-4">
                  <MdErrorOutline />
                  <span>{errorMessage}</span>
                </div>
              ) : null}
            </form>

            {errorMessage ? (
              <div className="alert alert-error mt-4 text-white text-sm">
                <MdErrorOutline className="text-3xl" />
                <span>{errorMessage}</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <GlobalLoading />
      )}
    </ProtectedPage>
  );
}
