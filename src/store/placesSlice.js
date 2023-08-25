import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getFoodPlacesApi,
  getFoodShopByIdApi,
  updateFoodShopByIdApi,
  deleteFoodShopByIdApi,
  uploadFoodShopDataApi,
  getFoodShopByEmailApi,
} from "../api/foodshopsAPI";
import { toast } from "react-toastify";
const initialPlacesState = {
  foodplaces: [],
  foodplace: {},
  isLoading: false,
  error: null,
};
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

export const uploadFoodShopData = createAsyncThunk(
  "content/uploadFoodShopData",
  async (data, thunkAPI) => {
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
    // console.log(imageRes);
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
      return { ...resData, id: resData._id };
    } catch (error) {
      console.error(error);
    }
  }
);
export const getFoodShopById = createAsyncThunk(
  "content/getData",
  async (data, thunkAPI) => {
    const { id } = data;
    await thunkAPI.dispatch(fetchPlaces());
    const foodplaces = thunkAPI.getState().places.foodplaces;
    const foodplaceData = foodplaces.filter((place) => place.id === id)[0];
    return foodplaceData;
  }
);
export const getFoodShopByEmail = createAsyncThunk(
  "content/getDataByEmail",
  async (data, thunkAPI) => {
    const { email } = data;
    const foodplaceData = await getFoodShopByEmailApi(email);
    // console.log({ foodplaceData });
    return foodplaceData.data;
  }
);

// update data function
export const updateData = createAsyncThunk(
  "content/updateData",
  async (data, thunkAPI) => {
    const { index, id, values, discount } = data;
    // // console.log(data);
    let result;
    // thunkAPI.dispatch(fetchPlaces());
    const foodplaces = thunkAPI.getState().places.foodplaces;
    try {
      let newValues = { ...values };
      const getResponse = await getFoodShopByIdApi(id);
      result = getResponse.data;
      result = { ...result, ...newValues, id: id, index: index };
      // console.log(result);

      if (discount.item !== undefined) {
        result.discounts[result.discounts.length] = {
          item: discount.item,
          discount: discount.discount,
        };
      }
      // // console.log({ newValues });
      const updatedFoodPlaces = foodplaces.map((place) =>
        place._id === id ? result : place
      );
      const response = await updateFoodShopByIdApi(id, result);
      if (response.status === "success") {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      // console.log({ result });
      return [updatedFoodPlaces, result];
    } catch (error) {
      console.log({ error });
    }
  }
);

// delete discount item
export const deleteItem = createAsyncThunk(
  "content/deleteItem",
  async (data) => {
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
      // console.log({ index, discounts });
      return [id, discounts];
    } catch (error) {
      console.log({ error });
    }
  }
);

// fetch data
export const fetchPlaces = createAsyncThunk("content/fetchPlaces", async () => {
  const response = await getFoodPlacesApi();
  const resData = response.data;
  // console.log(resData);
  // const querySnapshot = await getDocs(collection(firestore, "foodshops"));
  const data = [];
  let temp = {};
  let i = 0;
  resData.forEach((doc) => {
    temp = { ...doc, id: doc._id, index: i };
    data.push(temp);
    i++;
  });
  // // console.log(data);
  return data;
});

// update likes
export const updateLikes = createAsyncThunk(
  "content/updateLikes",
  async (data) => {
    const { id, dislikes, likes, user } = data;
    // console.log({ data });
    try {
      let uLikes = likes,
        uDislikes = dislikes;
      const response = await getFoodShopByIdApi(id);
      const result = response.data;
      let liked = result.liked;
      let disliked = result.disliked;
      // console.log(liked);
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
      return [id, uLikes, uDislikes, liked, disliked];
    } catch (error) {
      console.log({ error });
      return error;
    }
  }
);

// update dislikes
export const updateDislikes = createAsyncThunk(
  "content/updateDislikes",
  async (data) => {
    const { id, dislikes, likes, user } = data;
    // console.log({ data });
    try {
      let uDislikes = dislikes,
        uLikes = likes;
      const response = await getFoodShopByIdApi(id);
      const result = response.data;
      let disliked = result.disliked;
      let liked = result.liked;
      // console.log({ disliked });
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
      return [id, uLikes, uDislikes, liked, disliked];
    } catch (error) {
      console.log({ error });
      return error;
    }
  }
);

// add comment
export const addComment = createAsyncThunk(
  "content/addComment",
  async (data) => {
    const { id, user, values } = data;
    // console.log(data);
    try {
      const response = await getFoodShopByIdApi(id);
      const result = response.data;
      let comments = result.comments;
      comments.push({ user: user.email, comment: values["comment"] });
      await updateFoodShopByIdApi(id, {
        comments: comments,
      });
      return [id, comments];
    } catch (error) {
      console.log({ error });
      return error;
    }
  }
);
// delete
export const deleteDataFromDb = createAsyncThunk(
  "content/delete",
  async (id, thunkAPI) => {
    // console.log({ id });
    let foodplaces;
    try {
      await deleteFoodShopByIdApi(id);
      foodplaces = thunkAPI.getState().places.foodplaces;
      foodplaces = foodplaces.filter((place) => place.id !== id);
      // console.log({ foodplaces });
      return foodplaces;
    } catch (error) {
      return ["failed to delete"];
    }
  }
);
const placesSlice = createSlice({
  name: "places",
  initialState: initialPlacesState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch place
    builder.addCase(fetchPlaces.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPlaces.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplaces = action.payload;
    });
    builder.addCase(fetchPlaces.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // delete
    builder.addCase(deleteDataFromDb.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteDataFromDb.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplaces = action.payload;
    });
    builder.addCase(deleteDataFromDb.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // get by id
    builder.addCase(getFoodShopById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFoodShopById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplace = action.payload;
    });
    builder.addCase(getFoodShopById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // get by email
    builder.addCase(getFoodShopByEmail.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFoodShopByEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplace = action.payload;
    });
    builder.addCase(getFoodShopByEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // upload data
    builder.addCase(uploadFoodShopData.pending, (state) => {
      state.isLoading = false;
    });
    builder.addCase(uploadFoodShopData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplaces.push(action.payload);
      state.foodplace = action.payload;
    });
    builder.addCase(uploadFoodShopData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // data update
    builder.addCase(updateData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplace = action.payload[1];
      state.foodplaces = action.payload[0];
      // state.foodplaces.filter((place) => place._id === action.payload[0])[0] =
      //   action.payload[1];
    });
    builder.addCase(updateData.rejected, (state, action) => {
      state.isLoading = false;
    });
    // delete discount item
    builder.addCase(deleteItem.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplace.discounts = action.payload[1];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].discounts = action.payload[1];
    });
    builder.addCase(deleteItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // likes
    builder.addCase(updateLikes.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateLikes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplace.likes = action.payload[1];
      state.foodplace.dislikes = action.payload[2];
      state.foodplace.liked = action.payload[3];
      state.foodplace.disliked = action.payload[4];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].likes = action.payload[1];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].dislikes = action.payload[2];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].liked = action.payload[3];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].disliked = action.payload[4];
    });
    builder.addCase(updateLikes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message;
    });
    // dislikes
    builder.addCase(updateDislikes.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateDislikes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplace.likes = action.payload[1];
      state.foodplace.dislikes = action.payload[2];
      state.foodplace.liked = action.payload[3];
      state.foodplace.disliked = action.payload[4];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].likes = action.payload[1];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].dislikes = action.payload[2];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].liked = action.payload[3];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].disliked = action.payload[4];
    });
    builder.addCase(updateDislikes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // comments
    builder.addCase(addComment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplace.comments = action.payload[1];
      state.foodplaces.filter(
        (place) => place._id === action.payload[0]
      )[0].comments = action.payload[1];
    });
    builder.addCase(addComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});
export const placeActions = placesSlice.actions;
export default placesSlice.reducer;
