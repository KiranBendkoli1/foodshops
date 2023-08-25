import axios from "axios";
import { api_url } from "./api";
export const getFoodPlacesApi = async () => {
  try {
    const response = await axios.get(
      `${api_url}/foodshops`
    );
    const resData = await response.data;
    return resData;
  } catch (error) {
    return error.response.data;
  }
};
export const getFoodShopByIdApi = async (id) => {
  try {
    const response = await axios.get(
      `${api_url}/foodshops/${id}`
    );
    const result = await response.data;
    return result;
  } catch (error) {
    return error.response.data;
  }
};
export const getFoodShopByEmailApi = async (email) => {
  try {
    const response = await axios.get(
      `${api_url}/foodshops/email/${email}`
    );
    const result = await response.data;
    return result;
  } catch (error) {
    return error.response.data;
  }
};
export const uploadFoodShopDataApi = async (data) => {
  try {
    const response = await axios.post(
      `${api_url}/foodshops/`,
      data
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   }
    );
    const resData = await response.data;
    // console.log(resData);
    return resData;
  } catch (error) {
    return error.response.data;
  }
};
export const updateFoodShopByIdApi = async (id, data) => {
  try {
    const updateResponse = await axios.put(
      `${api_url}/foodshops/${id}`,
      data
    );
    const result = await updateResponse.data;
    return result;
  } catch (error) {
    return error.response.data;
  }
};
export const deleteFoodShopByIdApi = async (id) => {
  try {
    const response = await axios.delete(
      `${api_url}/foodshops/${id}`
    );
    const data = await response.data;
    return data;
  } catch (error) {
    return error.response.data;
  }
};
