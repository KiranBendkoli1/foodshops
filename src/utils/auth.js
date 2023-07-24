import { auth, firestore } from "../config/firebase";
import { collection, addDoc, getDoc, setDoc, doc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const signUp = async (name, email, contact, password, userType) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully");
    await setDoc(doc(firestore, "roles", email), {
      email: email,
      role: userType,
    });
    if (userType === "regular") {
      const docRef = await setDoc(doc(firestore, "users", email), {
        name: name,
        email: email,
        date: new Date().toDateString(),
      });
      console.log(docRef.id);
    } else if (userType === "shopOwner") {
      const docRef = await setDoc(doc(firestore, "shopOwners", email), {
        shopname: name,
        email: email,
        contact: contact,
        date: new Date().toDateString(),
      });
      console.log(docRef.id);
    }
  } catch (error) {
    console.log(error);
  }
};

const signIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    const res = await getDoc(doc(firestore, "roles", email));
    console.log("User Logged In");
    return res.data();
  } catch (error) {
    console.log(error);
  }
};

const logout = async () => {
  await signOut(auth);
  console.log("User logged out");
};

export { signUp, signIn, logout };
