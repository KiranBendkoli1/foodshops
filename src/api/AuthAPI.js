import axios from "axios";

export const signInApi = async (email, password) => {
  try {
    const response = await axios.post(`http://localhost:5000/auth/login`, {
      email,
      password,
    });
    console.log(response);
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const signUpApi = async (name, email, contact, password, userType) => {
  try {
    const response = await axios.post(`http://localhost:5000/auth/register`, {
      name,
      email,
      contact,
      password,
      userType,
    });
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};
