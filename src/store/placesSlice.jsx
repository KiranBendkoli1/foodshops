import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../config/supabase";

const initialPlacesState = {
  foodplaces: [],
  foodplace: {},
  isLoading: false,
  error: null,
};

/// helping function
const uploadImage = async (image, shopname) => {
  const safeShopname = shopname.replace(/\s+/g, '_');
  const safeImageName = image.name.replace(/\s+/g, '_');
  const imagePath = `${safeShopname}/${Date.now()}-${safeImageName}`;
  const { data, error } = await supabase.storage
    .from("foodshops")
    .upload(imagePath, image);

  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }
  return data.path;
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
    const name = thunkAPI.getState().user.name;
    const contact = thunkAPI.getState().user.contact;
    const imgPromise = Array.from(images, (image) => uploadImage(image, name || "default"));
    const imageRes = await Promise.all(imgPromise);

    const res = {
      owner_email: email,
      title: name,
      speciality: speciality,
      location: location,
      description: description,
      select_position: selectPosition,
      contact: contact,
      type: type,
      image_paths: imageRes.filter(Boolean),
      posted_on: new Date().toDateString(),
    };
    try {
      const { data: dbData, error } = await supabase.from("foodshops").insert([res]).select();
      if (error) throw error;
      const createdItem = dbData[0];
      return {
        ...createdItem,
        comments: [],
        liked: [],
        disliked: [],
        discounts: [],
        images: (createdItem.image_paths || []).map(
          (p) => supabase.storage.from("foodshops").getPublicUrl(p).data.publicUrl
        ),
        likes: 0,
        dislikes: 0
      };
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
    const foodplaceData = foodplaces.filter((place) => String(place.id) === String(id))[0];
    return foodplaceData;
  }
);

// update data function
export const updateData = createAsyncThunk(
  "content/updateData",
  async (data, thunkAPI) => {
    const { index, id, values, image, discount } = data;
    let result;
    try {
      let newValues = { ...values };
      const { data: shopdata, error: shopError } = await supabase
        .from("foodshops")
        .select("*")
        .eq("id", id)
        .single();

      if (shopError) throw shopError;

      result = shopdata;
      result = { ...result, index };
      let discounts = shopdata.discounts || [];
      if (discount.trim() !== "|") {
        discounts.push(discount);
        newValues = { ...newValues, discounts: discounts };
        result = { ...result, discounts: discounts };
      }
      if (image !== "") {
        let image_paths = shopdata.image_paths || [];
        image_paths.push(image);
        newValues = { ...newValues, image_paths };
        result = { ...result, image_paths };
      }

      result = {
        ...result,
        ...newValues,
        images: (result.image_paths || []).map(
          (p) => supabase.storage.from("foodshops").getPublicUrl(p).data.publicUrl
        )
      };

      await supabase.from("foodshops").update(newValues).eq("id", id);
      return [index, result];
    } catch (error) {
    }
  }
);

// delete discount item
export const deleteItem = createAsyncThunk(
  "content/deleteItem",
  async (data) => {
    const { id, index, item } = data;
    try {
      const { data: shopdata } = await supabase.from("foodshops").select("discounts").eq("id", id).single();
      let discounts = shopdata.discounts || [];
      discounts = discounts.filter((discount) => discount !== item);
      await supabase.from("foodshops").update({ discounts }).eq("id", id);
      return [index, discounts];
    } catch (error) {
    }
  }
);

// fetch data
export const fetchPlaces = createAsyncThunk("content/fetchPlaces", async () => {
  const { data: shops, error } = await supabase
    .from("foodshops")
    .select(`
      *,
      foodshop_comments ( id, user_email, comment_text, created_at ),
      foodshop_interactions ( id, user_email, type )
    `);

  if (error) throw error;

  const shopsWithImages = await Promise.all(
    shops.map(async (shop, i) => {
      const comments = (shop.foodshop_comments || []).map(
        (c) => `${c.user_email} | ${c.comment_text}`
      );
      const liked = (shop.foodshop_interactions || [])
        .filter((int) => int.type === "like")
        .map((int) => int.user_email);
      const disliked = (shop.foodshop_interactions || [])
        .filter((int) => int.type === "dislike")
        .map((int) => int.user_email);

      return {
        ...shop,
        id: shop.id,
        index: i,
        comments,
        liked,
        disliked,
        images: (shop.image_paths || []).map(
          (p) => supabase.storage.from("foodshops").getPublicUrl(p).data.publicUrl
        ),
        likes: liked.length,
        dislikes: disliked.length,
      };
    })
  );

  return shopsWithImages;
});

// update likes
export const updateLikes = createAsyncThunk(
  "content/updateLikes",
  async (data) => {
    const { id, index, dislikes, likes, user } = data;
    try {
      let uLikes = likes, uDislikes = dislikes;
      const { data: interactions, error } = await supabase.from("foodshop_interactions").select("user_email, type").eq("foodshop_id", id);
      if (error) throw error;

      let liked = interactions.filter(i => i.type === 'like').map(i => i.user_email);
      let disliked = interactions.filter(i => i.type === 'dislike').map(i => i.user_email);

      if (liked.includes(user)) {
        uLikes = likes - 1;
        liked = liked.filter(e => e !== user);
        await supabase.from("foodshop_interactions").delete().match({ foodshop_id: id, user_email: user, type: 'like' });
      } else if (disliked.includes(user)) {
        disliked = disliked.filter(e => e !== user);
        uLikes = likes + 1;
        uDislikes = dislikes - 1;
        liked.push(user);
        await supabase.from("foodshop_interactions").update({ type: 'like' }).match({ foodshop_id: id, user_email: user });
      } else {
        uLikes = likes + 1;
        liked.push(user);
        await supabase.from("foodshop_interactions").insert({ foodshop_id: id, user_email: user, type: 'like' });
      }

      return [index, uLikes, uDislikes, liked, disliked];
    } catch (error) {
      return error;
    }
  }
);

// update dislikes
export const updateDislikes = createAsyncThunk(
  "content/updateDislikes",
  async (data) => {
    const { id, index, dislikes, likes, user } = data;
    try {
      let uDislikes = dislikes, uLikes = likes;
      const { data: interactions, error } = await supabase.from("foodshop_interactions").select("user_email, type").eq("foodshop_id", id);
      if (error) throw error;

      let liked = interactions.filter(i => i.type === 'like').map(i => i.user_email);
      let disliked = interactions.filter(i => i.type === 'dislike').map(i => i.user_email);

      if (disliked.includes(user)) {
        uDislikes = dislikes - 1;
        disliked = disliked.filter(e => e !== user);
        await supabase.from("foodshop_interactions").delete().match({ foodshop_id: id, user_email: user, type: 'dislike' });
      } else if (liked.includes(user)) {
        liked = liked.filter(e => e !== user);
        uDislikes = dislikes + 1;
        uLikes = likes - 1;
        disliked.push(user);
        await supabase.from("foodshop_interactions").update({ type: 'dislike' }).match({ foodshop_id: id, user_email: user });
      } else {
        uDislikes = dislikes + 1;
        disliked.push(user);
        await supabase.from("foodshop_interactions").insert({ foodshop_id: id, user_email: user, type: 'dislike' });
      }

      return [index, uLikes, uDislikes, liked, disliked];
    } catch (error) {
      return error;
    }
  }
);

// add comment
export const addComment = createAsyncThunk(
  "content/addComment",
  async (data) => {
    const { id, user, index, values } = data;
    try {
      await supabase.from("foodshop_comments").insert({ foodshop_id: id, user_email: user, comment_text: values["comment"] });
      const { data: commentsData } = await supabase.from("foodshop_comments").select("*").eq("foodshop_id", id);
      let comments = commentsData.map(c => `${c.user_email} | ${c.comment_text}`);
      return [index, comments];
    } catch (error) {
      return error;
    }
  }
);

// delete
export const deleteDataFromDb = createAsyncThunk(
  "content/delete",
  async (id, thunkAPI) => {
    let foodplaces;
    try {
      await supabase.from("foodshops").delete().eq("id", id);
      foodplaces = thunkAPI.getState().places.foodplaces;
      foodplaces = foodplaces.filter((place) => place.id !== id);
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
