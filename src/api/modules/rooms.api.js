import privateClient from "../clients/private.client";

const roomsEndpoint = {
  rooms: "/rooms",
  joinRoom: "/rooms/join",
  roomById: ({ roomId }) => `/rooms/${roomId}`,
  userRooms: "/rooms/user-rooms",
  startRoom: ({ roomId }) => `/rooms/start/${roomId}`,
  increaseScore: ({ roomId }) => `/rooms/increase-score/${roomId}`,
};

const roomsApi = {
  createRoom: async ({ name, description }) => {
    try {
      const response = await privateClient.post(roomsEndpoint.rooms, {
        name,
        description,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  joinRoom: async ({ code }) => {
    try {
      const response = await privateClient.post(roomsEndpoint.joinRoom, {
        code,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getRoomById: async ({ roomId }) => {
    try {
      const response = await privateClient.get(
        roomsEndpoint.roomById({ roomId })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  updateRoom: async ({ roomId, name, description, status }) => {
    try {
      const response = await privateClient.put(
        roomsEndpoint.roomById({ roomId }),
        {
          name,
          description,
          status,
        }
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getUserRooms: async () => {
    try {
      const response = await privateClient.get(roomsEndpoint.userRooms);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  startRoom: async ({ roomId }) => {
    try {
      const response = await privateClient.put(
        roomsEndpoint.startRoom({ roomId })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  increaseScore: async ({ roomId }) => {
    try {
      const response = await privateClient.put(
        roomsEndpoint.increaseScore({ roomId })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default roomsApi;
