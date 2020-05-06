let accessToken = "";

export const setAuthToken = (token: string) => {
  accessToken = token;
};

export const getAuthToken = () => {
  return accessToken;
};
