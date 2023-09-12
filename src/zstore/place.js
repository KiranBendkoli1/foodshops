import { create } from "zustand";
import { toast } from "react-toastify";
import {
  getFoodPlacesApi,
  getFoodShopByIdApi,
  updateFoodShopByIdApi,
  deleteFoodShopByIdApi,
  uploadFoodShopDataApi,
  getFoodShopByEmailApi,
} from "../api/foodshopsAPI";

// helper function
const getBase64 = (image, cb) => {
  return new Promise((resolve) => {
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();
    // Convert the file to base64 text
    reader.readAsDataURL(image);
    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      // console.log("Called", reader);
      baseURL = reader.result;
      // console.log(baseURL);
      resolve(baseURL);
    };
    // console.log(fileInfo);
  });
};

const usePlaceStore = create((set, get) => ({
  foodplaces: [],
  foodplace: {},
  isLoading: false,
  error: null,
  fetchPlaces: async () => {
    set({ isLoading: true });
    const response = await getFoodPlacesApi();
    const resData = response.data;
    const res = [];
    let temp = {};
    let i = 0;
    resData.forEach((doc) => {
      temp = { ...doc, id: doc._id, index: i };
      res.push(temp);
      i++;
    });
    set({ isLoading: false, foodplaces: res });
  },
  getFoodShopById: async (data) => {
    set({ isLoading: true });
    const { id } = data;
    const foodplaces = get().foodplaces;
    const foodplace = foodplaces.filter((place) => place.id === id)[0];
    set({ isLoading: false, foodplace: foodplace });
  },
  getFoodShopByEmail: async (data) => {
    set({ isLoading: true });
    const { email } = data;
    const foodplaceData = await getFoodShopByEmailApi(email);
    set({ isLoading: false, foodplace: foodplaceData.data });
  },
  uploadFoodShopData: async (data) => {
    set({ isLoading: true });
    const {
      title,
      contact,
      email,
      speciality,
      description,
      selectPosition,
      address,
      images,
      type,
    } = data;
    const imgPromise = Array.from(images, (image) => getBase64(image));
    const imageRes = await Promise.all(imgPromise);
    let x = Math.floor(Math.random() * 100 + 1);
    try {
      const res = {
        key: `${x} ${title}`,
        title: title,
        email: email,
        speciality: speciality,
        address: address,
        description: description,
        selectPosition: selectPosition,
        contact: contact,
        type: type,
        images: imageRes,
        postedOn: new Date().toDateString(),
      };
      // console.log(res);
      const response = await uploadFoodShopDataApi(res);
      const resData = response.data;
      if (response.status === "success") {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      const myfoodplace = { ...resData, id: resData._id };
      const foodplaces = get().foodplaces;
      foodplaces.append(myfoodplace);
      set({
        isLoading: false,
        foodplaces: foodplaces,
        foodplace: myfoodplace,
      });
    } catch (error) {
      console.error(error);
      set({ error: error.message });
    }
  },
  updateData: async (data) => {
    set({ isLoading: true });
    const { index, id, values, discount } = data;
    let result;
    const foodplaces = get().foodplaces;
    try {
      const getResponse = await getFoodShopByIdApi(id);
      result = getResponse.data;
      console.log(result);
      result = { ...result, ...values, id: id, index: index };
      if (discount.item !== undefined)
        result.discounts[result.discounts.length] = discount;
      console.log(result);
      const updatedFoodPlaces = foodplaces.map((place) =>
        place._id === id ? result : place
      );
      console.log(result);
      const response = await updateFoodShopByIdApi(id, result);
      if (response.status === "success") {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      console.log([updatedFoodPlaces, result]);
      set({
        isLoading: false,
        foodplaces: updatedFoodPlaces,
        foodplace: result,
      });
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message });
    }
  },
  deleteItem: async (data) => {
    set({ isLoading: true });

    const { id, item } = data;
    try {
      // console.log({ data });
      const getResponse = await getFoodShopByIdApi(id);
      const result = getResponse.data;
      let discounts = result.discounts;
      // // console.log({ discounts });
      discounts = discounts.filter((discount) => discount.item !== item.item);
      // // console.log({ discounts });
      await updateFoodShopByIdApi(id, {
        discounts: discounts,
      });
      result.discounts = discounts;
      const foodplaces = get().foodplaces;
      foodplaces.filter((place) => place._id === id)[0].discounts = discounts;
      set({ isLoading: false, foodplaces: foodplaces, foodplace: result });
    } catch (error) {
      console.log({ error });
      set({ error: error.message });
    }
  },
  updateLikes: async (data) => {
    set({ isLoading: true });
    const { id, dislikes, likes, user } = data;
    try {
      let uLikes = likes,
        uDislikes = dislikes;
      const response = await getFoodShopByIdApi(id);
      let result = response.data;
      let liked = result.liked;
      let disliked = result.disliked;
      if (liked.find((e) => e === user.email)) {
        uLikes = likes !== 0 ? likes - 1 : likes;
        liked = liked.filter((e) => e !== user.email);
      } else if (disliked.find((e) => e === user.email)) {
        disliked = disliked.filter((e) => e !== user.email);
        uLikes = likes + 1;
        uDislikes = dislikes !== 0 ? dislikes - 1 : 0;
        liked.push(user.email);
      } else {
        uLikes = likes + 1;
        liked.push(user.email);
      }
      await updateFoodShopByIdApi(id, {
        likes: uLikes,
        liked: liked,
        dislikes: uDislikes,
        disliked: disliked,
      });
      result = {
        ...result,
        likes: uLikes,
        liked: liked,
        dislikes: uDislikes,
        disliked: disliked,
      };
      const foodplaces = get().foodplaces;
      foodplaces.filter((place) => place.id === id)[0] = result;
      set({ isLoading: false, foodplaces: foodplaces, foodplace: result });
    } catch (error) {
      console.log({ error });
      set({ error: error.message });
      return error;
    }
  },
  updateDislikes: async (data) => {
    set({ isLoading: true });
    const { id, dislikes, likes, user } = data;
    try {
      let uDislikes = dislikes,
        uLikes = likes;
      const response = await getFoodShopByIdApi(id);
      let result = response.data;
      let disliked = result.disliked;
      let liked = result.liked;
      if (disliked.find((e) => e === user.email)) {
        uDislikes = dislikes !== 0 ? dislikes - 1 : dislikes;
        disliked = disliked.filter((e) => e !== user.email);
      } else if (liked.find((e) => e === user.email)) {
        liked = liked.filter((e) => e !== user.email);
        uDislikes = dislikes + 1;
        uLikes = likes !== 0 ? likes - 1 : likes;
        disliked.push(user.email);
      } else {
        disliked.push(user.email);
        uDislikes = dislikes + 1;
      }
      await updateFoodShopByIdApi(id, {
        likes: uLikes,
        liked: liked,
        dislikes: uDislikes,
        disliked: disliked,
      });
      result = {
        ...result,
        likes: uLikes,
        liked: liked,
        dislikes: uDislikes,
        disliked: disliked,
      };
      const foodplaces = get().foodplaces;
      foodplaces.filter((place) => place._id === id)[0] = result;
      set({ isLoading: false, foodplaces: foodplaces, foodplace: result });
    } catch (error) {
      console.log({ error });
      set({ error: error.message });
    }
  },
  addComment: async (data) => {
    set({ isLoading: true });
    const { id, user, values } = data;
    try {
      const response = await getFoodShopByIdApi(id);
      let result = response.data;
      let comments = result.comments;
      comments.push({ user: user.email, comment: values["comment"] });
      await updateFoodShopByIdApi(id, {
        comments: comments,
      });
      result.comments = comments;
      const foodplaces = get().foodplaces;
      foodplaces.filter((place) => place._id === id)[0] = result;
      set({ isLoading: false, foodplaces: foodplaces, foodplace: result });
    } catch (error) {
      console.log({ error });
      set({ error: error.message });
    }
  },
  deleteDataFromDb: async (id) => {
    try {
      await deleteFoodShopByIdApi(id);
      let foodplaces = get().foodplaces;
      foodplaces = foodplaces.filter((place) => place.id !== id);
      set({ foodplaces: foodplaces });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default usePlaceStore;
