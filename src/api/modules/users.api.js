import publicClient from "../clients/public.client";
import privateClient from "../clients/private.client";

const usersEndpoint = {
  signUp: "/users/sign-up",
  signIn: "/users/sign-in",
  profile: "/users/profile",
};

const userApi = {
  signUp: async ({ userUID, firstName, lastName }) => {
    try {
      const response = await publicClient.post(usersEndpoint.signUp, {
        userUID,
        firstName,
        lastName,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  signIn: async ({ userUID }) => {
    try {
      const response = await publicClient.post(usersEndpoint.signIn, {
        userUID,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getProfile: async () => {
    try {
      const response = await privateClient.get(usersEndpoint.profile);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  updateProfile: async ({ firstName, lastName, age, city }) => {
    try {
      const response = await privateClient.put(usersEndpoint.profile, {
        firstName,
        lastName,
        age,
        city,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default userApi;
