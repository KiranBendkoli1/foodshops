import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, doc, updateDoc,getDoc } from "firebase/firestore";
import { storage, firestore } from "../config/firebase";
// const storage = getStorage();
const uploadFoodPlaceData = async (
  title,
  speciality,
  description,
  location,
  image
) => {
  const imgRef = ref(storage, `foodshops/${image.name}`);
  const uploadTask = await uploadBytes(imgRef, image);
  const url = await getDownloadURL(uploadTask.ref);
  let x = Math.floor(Math.random() * 100 + 1);

  const docRef = await addDoc(collection(firestore, "foodshops"), {
    key: `${x} ${title}`,
    title: title,
    speciality: speciality,
    location: location,
    description: description,
    likes: 0,
    dislikes: 0,
    liked: [],
    disliked: [],
    comments: [],
    image: url.toString(),
    postedOn: new Date().toDateString(),
  });
  console.log(docRef.id);
};

const updateData = async (id, values, image, discount) => {
  try {
    const shopdata = await getDoc(doc(firestore, "foodshops", id));
    let discounts = shopdata.data().discounts;
    discounts.push(discount)
    const newValues = { ...values, image: image ,discounts:discounts};
    console.log({ newValues });
    updateDoc(doc(firestore, "foodshops", id), newValues).then(() => {
      console.log("Updated Successfully", { newValues });
    });
  } catch (error) {
    console.log({ error });
  }
};

export { uploadFoodPlaceData, updateData };
