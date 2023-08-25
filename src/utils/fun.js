import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { storage, firestore } from "../config/firebase";
// const storage = getStorage();

const uploadImage = async (image) => {
  const imgRef = ref(storage, `foodshops/${Date.now()}-${image.name}`);
  const uploadTask = await uploadBytes(imgRef, image);
  const url = await getDownloadURL(uploadTask.ref);
  return url;
};

const uploadFoodPlaceData = async (
  title,
  speciality,
  description,
  address,
  contact,
  images,
  type
) => {
  const imgPromise =  Array.from(images, (image) => uploadImage(image));
  const imageRes  = await Promise.all(imgPromise);

  // images.forEach((file) => {
  //   imgArray.push(url);
  // });
  console.log({imageRes})
  let x = Math.floor(Math.random() * 100 + 1);

  const docRef = await addDoc(collection(firestore, "foodshops"), {
    key: `${x} ${title}`,
    title: title,
    speciality: speciality,
    address: address,
    description: description,
    likes: 0,
    dislikes: 0,
    contact: contact,
    liked: [],
    discounts:[],
    disliked: [],
    comments: [],
    type: type,
    images: imageRes,
    postedOn: new Date().toDateString(),
  });
  console.log(docRef.id);
};

const updateData = async (id, values, image, discount) => {
  try {
    let newValues = { ...values };
    if (discount.trim() !== "|") {
      const shopdata = await getDoc(doc(firestore, "foodshops", id));
      let discounts = shopdata.data().discounts;
      discounts.push(discount);
      newValues = { ...newValues, discounts: discounts };
    }
    if (image !== "") {
      newValues = { ...newValues, image: image };
    }
    console.log({ newValues });
    updateDoc(doc(firestore, "foodshops", id), { ...newValues }).then(() => {
      console.log("Updated Successfully", { newValues });
    });
  } catch (error) {
    console.log({ error });
  }
};

export { uploadFoodPlaceData, updateData };
