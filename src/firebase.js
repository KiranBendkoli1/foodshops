// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXlLjvrfnIBEK1Dbek7wqZeFggYne9lK8",
  authDomain: "food-places-e37db.firebaseapp.com",
  projectId: "food-places-e37db",
  storageBucket: "food-places-e37db.appspot.com",
  messagingSenderId: "920897204810",
  appId: "1:920897204810:web:2d8bc16fc848c41eceecb3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;