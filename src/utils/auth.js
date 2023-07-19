import { auth, firestore } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

const signUp = async (name, email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully");
    const docRef = await addDoc(collection(firestore, "users"), {
      name: name,
      email: email,
      date: new Date().toDateString(),
    });
    console.log(docRef.id); 
  } catch (error) {
    console.log(error);
  }
};

const signIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("User Logged In");
  } catch (error) {
    console.log(error);
  }
};

const logout = async ()=>{
  await signOut(auth);
  console.log("User logged out")
}


export { signUp, signIn, logout};
