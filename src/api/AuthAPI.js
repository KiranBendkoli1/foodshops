import axios from "axios";
import { api_url } from "./api";

export const signInApi = async (email, password) => {
  try {
    const response = await axios.post(
      `${api_url}/auth/login`,
      {
        email,
        password,
      }
    );
    console.log(response);
    const result = await response.data;
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const signUpApi = async (name, email, contact, password, userType) => {
  try {
    const response = await axios.post(
      `${api_url}/auth/register`,
      {
        name,
        email,
        contact,
        password,
        userType,
      }
    );
    const result = await response.data;
    return result;
  } catch (error) {
    return error.response.data;
  }
};
