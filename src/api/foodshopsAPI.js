import axios from "axios";
export const getFoodPlacesApi = async () => {
  try {
    const response = await axios.get("http://localhost:5000/foodshops");
    const resData = await response.data;
    return resData;
  } catch (error) {
    console.log(error);
  }
};
export const getFoodShopByIdApi = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/foodshops/${id}`);
    const result = await response.data;
    // console.log({ "Get Food Shop": result });
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const getFoodShopByEmailApi = async (email) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/foodshops/email/${email}`
    );
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const uploadFoodShopDataApi = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/foodshops/",
      data
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   }
    );
    const resData = await response.data;
    // console.log(resData);
    return resData;
  } catch (error) {}
};
export const updateFoodShopByIdApi = async (id, data) => {
  try {
    const updateResponse = await axios.put(
      `http://localhost:5000/foodshops/${id}`,
      data
    );
    const result = await updateResponse.data;
    return result;
  } catch (error) {}
};
export const deleteFoodShopByIdApi = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/foodshops/${id}`
    );
    const data = await response.data;
    return data;
  } catch (error) {}
};
