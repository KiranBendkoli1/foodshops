import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "../config/firebase";
const initialPlacesState = {
  foodplaces: [],
  foodplace: {},
  isLoading: false,
  error: null,
};

/// helping function
const uploadImage = async (image) => {
  const imgRef = ref(storage, `foodshops/${Date.now()}-${image.name}`);
  const uploadTask = await uploadBytes(imgRef, image);
  const url = await getDownloadURL(uploadTask.ref);
  return url;
};

export const uploadFoodShopData = createAsyncThunk(
  "content/uploadFoodShopData",
  async (data, thunkAPI) => {
    const {
      email,
      speciality,
      description,
      selectPosition,
      location,
      images,
      type,
    } = data;
    console.log(data);
    const name = thunkAPI.getState().user.name;
    const contact = thunkAPI.getState().user.contact;
    const imgPromise = Array.from(images, (image) => uploadImage(image));
    const imageRes = await Promise.all(imgPromise);

    // images.forEach((file) => {
    //   imgArray.push(url);
    // });
    console.log({ imageRes });
    let x = Math.floor(Math.random() * 100 + 1);

    const res = {
      key: `${x} ${name}`,
      title: name,
      email: email,
      speciality: speciality,
      location: location,
      description: description,
      selectPosition: selectPosition,
      likes: 0,
      dislikes: 0,
      contact: contact,
      liked: [],
      discounts: [],
      disliked: [],
      comments: [],
      type: type,
      images: imageRes,
      postedOn: new Date().toDateString(),
    };
    console.log(res);
    try {
      const docRef = await setDoc(doc(firestore, "foodshops", email), res);
      console.log(docRef.id);
      return { ...res, id: docRef.id };
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
    console.log({ foodplaceData });

    return foodplaceData;
    // const shopdata = await getDoc(doc(firestore, "foodshops", id));
    // let res = shopdata.data();
    // console.log(res);
    // res = { ...res, id: id };
    // console.log({ res });
    // return res;
  }
);

// update data function
export const updateData = createAsyncThunk(
  "content/updateData",
  async (data, thunkAPI) => {
    const { index, id, values, image, discount } = data;
    console.log(data);
    let result;
    let discounts;
    thunkAPI.dispatch(fetchPlaces());
    try {
      let newValues = { ...values };
      if (discount.trim() !== "|") {
        const shopdata = await getDoc(doc(firestore, "foodshops", id));
        result = shopdata.data();
        discounts = shopdata.data().discounts;
        discounts.push(discount);
        newValues = { ...newValues, discounts: discounts };
        result = { ...result, discounts: discounts, id: id, index: index };
      }
      if (image !== "") {
        newValues = { ...newValues, image: image };
      }
      console.log({ newValues });
      updateDoc(doc(firestore, "foodshops", id), { ...newValues }).then(() => {
        console.log("Updated Successfully", { newValues });
      });
      console.log(result);
      return [index, result];
    } catch (error) {
      console.log({ error });
    }
  }
);

// delete discount item
export const deleteItem = createAsyncThunk(
  "content/deleteItem",
  async (data) => {
    const { id, index, item } = data;
    try {
      console.log({ data });
      const mydoc = await getDoc(doc(firestore, "foodshops", id));
      let discounts = mydoc.data().discounts;
      console.log({ discounts });
      discounts = discounts.filter((discount) => discount !== item);
      console.log({ discounts });
      await updateDoc(doc(firestore, "foodshops", id), {
        discounts: discounts,
      });
      console.log({ index, discounts });
      return [index, discounts];
    } catch (error) {
      console.log({ error });
    }
  }
);

// fetch data
export const fetchPlaces = createAsyncThunk("content/fetchPlaces", async () => {
  const querySnapshot = await getDocs(collection(firestore, "foodshops"));
  const data = [];
  let temp = {};
  let i = 0;
  querySnapshot.forEach((doc) => {
    temp = doc.data();
    temp = { ...temp, id: doc.id, index: i };
    data.push(temp);
    i++;
  });
  return data;
});

// update likes
export const updateLikes = createAsyncThunk(
  "content/updateLikes",
  async (data) => {
    const { id, index, dislikes, likes, user } = data;
    console.log({ data });
    try {
      let uLikes = likes,
        uDislikes = dislikes;
      const shopdata = await getDoc(doc(firestore, "foodshops", id));
      let liked = shopdata.data().liked;
      let disliked = shopdata.data().disliked;
      console.log(liked);
      if (liked.find((e) => e === user)) {
        uLikes = likes - 1;
        liked = liked.filter((e) => e !== user);
      } else if (disliked.find((e) => e === user)) {
        disliked = disliked.filter((e) => e !== user);
        uLikes = likes + 1;
        uDislikes = dislikes - 1;
        liked.push(user);
      } else {
        uLikes = likes + 1;
        liked.push(user);
      }
      await updateDoc(doc(firestore, "foodshops", id), {
        likes: uLikes,
        liked: liked,
        dislikes: uDislikes,
        disliked: disliked,
      });
      return [index, uLikes, uDislikes, liked, disliked];
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
    const { id, index, dislikes, likes, user } = data;
    console.log({ data });
    try {
      let uDislikes = dislikes,
        uLikes = likes;
      const shopdata = await getDoc(doc(firestore, "foodshops", id));
      let disliked = shopdata.data().disliked;
      let liked = shopdata.data().liked;
      console.log({ disliked });
      if (disliked.find((e) => e === user)) {
        uDislikes = dislikes - 1;
        disliked = disliked.filter((e) => e !== user);
      } else if (liked.find((e) => e === user)) {
        liked = liked.filter((e) => e !== user);
        uDislikes = dislikes + 1;
        uLikes = likes - 1;
        disliked.push(user);
      } else {
        disliked.push(user);
        uDislikes = dislikes + 1;
      }
      // console.log({ disliked });
      // console.log({ liked });
      await updateDoc(doc(firestore, "foodshops", id), {
        likes: uLikes,
        liked: liked,
        dislikes: uDislikes,
        disliked: disliked,
      });
      return [index, uLikes, uDislikes, liked, disliked];
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
    const { id, user, index, values } = data;
    console.log(data);
    try {
      const shopdata = await getDoc(doc(firestore, "foodshops", id));
      let comments = shopdata.data().comments;
      comments.push(`${user} | ${values["comment"]}`);
      await updateDoc(doc(firestore, "foodshops", id), {
        comments: comments,
      });
      return [index, comments];
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
    // const { id } = data;
    console.log({ id });
    let foodplaces;
    try {
      await deleteDoc(doc(firestore, "foodshops", id));
      foodplaces = thunkAPI.getState().places.foodplaces;
      foodplaces = foodplaces.filter((place) => place.id !== id);
      console.log({ foodplaces });
      return foodplaces;
    } catch (error) {
      return ["failed to delete"];
    }
  }
);
const placesSlice = createSlice({
  name: "places",
  initialState: initialPlacesState,
  reducers: {
    // getFoodShopById(state, action) {
    //   state.foodplace = state.foodplaces.filter(
    //     (fs) => fs.id === action.payload
    //   )[0];
    // },
  },
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
    // upload data
    builder.addCase(uploadFoodShopData.pending, (state) => {
      state.isLoading = false;
    });
    builder.addCase(uploadFoodShopData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foodplaces.push(action.payload);
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
      state.foodplaces[action.payload[0]] = action.payload[1];
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
      state.foodplaces[action.payload[0]].discounts = action.payload[1];
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
      state.foodplaces[action.payload[0]].likes = action.payload[1];
      state.foodplaces[action.payload[0]].dislikes = action.payload[2];
      state.foodplaces[action.payload[0]].liked = action.payload[3];
      state.foodplaces[action.payload[0]].disliked = action.payload[4];
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
      state.foodplaces[action.payload[0]].likes = action.payload[1];
      state.foodplaces[action.payload[0]].dislikes = action.payload[2];
      state.foodplaces[action.payload[0]].liked = action.payload[3];
      state.foodplaces[action.payload[0]].disliked = action.payload[4];
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
      state.foodplaces[action.payload[0]].comments = action.payload[1];
    });
    builder.addCase(addComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});
export const placeActions = placesSlice.actions;
export default placesSlice.reducer;
