import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
const initialPlacesState = {
  foodplaces: [],
  foodplace: {},
  isLoading: false,
  error: null,
};

export const getFoodShopById = createAsyncThunk(
  "content/getData",
  async (data) => {
    const { id } = data;
    const shopdata = await getDoc(doc(firestore, "foodshops", id));
    let res = shopdata.data();
    console.log(res);
    res = { ...res, id: id };
    console.log({ res });
    return res;
  }
);

export const updateData = createAsyncThunk(
  "content/updateData",
  async (id, values, image) => {
    try {
      const newValues = { ...values, image: image };
      console.log({ newValues });
      updateDoc(doc(firestore, "foodshops", id), newValues).then(() => {
        console.log("Updated Successfully", { newValues });
      });
    } catch (error) {
      console.log({ error });
    }
  }
);
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
      return [index, discounts];
    } catch (error) {
      console.log({ error });
    }
  }
);
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
    // data update
    builder.addCase(updateData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateData.fulfilled, (state, action) => {
      state.isLoading = false;
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
