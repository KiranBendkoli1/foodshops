import supabase from "../config/supabase";

const uploadImage = async (image, shopname) => {
  const imagePath = `foodshops/${shopname}/${Date.now()}-${image.name}`;
  const { data, error } = await supabase.storage
    .from("foodshops")
    .upload(imagePath, image);

  if (error) {
    console.error("Error uploading image: ", error);
    return null;
  }
  return data.path;
};

const uploadFoodPlaceData = async (
  title,
  speciality,
  description,
  location,
  contact,
  images,
  type
) => {
  const imgPromise = Array.from(images, (image) => uploadImage(image));
  const imageRes = await Promise.all(imgPromise);

  const { data, error } = await supabase.from("foodshops").insert([
    {
      title: title,
      speciality: speciality,
      description: description,
      location: location,
      contact: contact,
      type: type,
      image_paths: imageRes.filter(Boolean),
      posted_on: new Date().toDateString(),
    },
  ]).select();

  if (error) {
    console.error(error);
  } else {
  }
};

const updateData = async (id, values, image, discount) => {
  try {
    let newValues = { ...values };
    if (discount && discount.trim() !== "|") {
      const { data: shopdata, error: fetchErr } = await supabase
        .from("foodshops")
        .select("discounts")
        .eq("id", id)
        .single();

      if (fetchErr) throw fetchErr;

      let discounts = shopdata.discounts || [];
      discounts.push(discount);
      newValues = { ...newValues, discounts: discounts };
    }

    if (image !== "") {
      newValues = { ...newValues, image_paths: [image] }; // Replace or add image logic
    }
    
    const { error: updateErr } = await supabase
      .from("foodshops")
      .update(newValues)
      .eq("id", id);
      
    if (updateErr) throw updateErr;
  } catch (error) {
  }
};

export { uploadFoodPlaceData, updateData };
