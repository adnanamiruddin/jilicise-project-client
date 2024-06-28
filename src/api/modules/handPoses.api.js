import privateClient from "../clients/private.client";

const handPosesEndpoint = {
  handPoses: "/hand-poses",
  handPosesByRoomId: ({ roomId }) => `/hand-poses/${roomId}`,
};

const handPosesApi = {
  getAllHandPosesGroupByType: async () => {
    try {
      const response = await privateClient.get(handPosesEndpoint.handPoses);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  setHandPose: async ({ roomId, typeOfHandPoseId, duration }) => {
    try {
      const response = await privateClient.put(
        handPosesEndpoint.handPosesByRoomId({ roomId }),
        {
          typeOfHandPoseId,
          duration,
        }
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  deleteHandPoseFromRoom: async ({ roomId, typeOfHandPoseId }) => {
    try {
      const response = await privateClient.delete(
        handPosesEndpoint.handPosesByRoomId({ roomId }),
        {
          data: { typeOfHandPoseId },
        }
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getHandPosesByRoomId: async ({ roomId }) => {
    try {
      const response = await privateClient.get(
        handPosesEndpoint.handPosesByRoomId({ roomId })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default handPosesApi;
