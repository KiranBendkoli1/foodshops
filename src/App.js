import { useEffect } from "react";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home/HomePage";
import AddFoodPlace from "./Components/ShopOwener/AddFoodPlace";
import Navbar from "./Components/UI/Navbar";
import classes from "./Components/Home/HomePage.module.css";
import { Layout } from "antd";
import Comments from "./Components/Home/Comments";
import DetailsPage from "./Components/Home/DetailsPage";
import AdminHome from "./Components/Admin/AdminHome";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { useDispatch } from "react-redux";
import { fetchPlaces } from "./store/placesSlice";
import OwnersHomepage from "./Components/ShopOwener/OwnersHomepage";
import CompleteDetails from "./Components/ShopOwener/CompleteDetails";

const { Header, Content } = Layout;
function App() {
  const dispatch = useDispatch()
useEffect(() => {
  dispatch(fetchPlaces());
  // console.log(foodplaces);
}, []);
  return (
    <>
      <BrowserRouter>
        <Header className={classes.header}>
          <Navbar />
        </Header>
        <Content className={classes.content}>
          <Routes>
            <Route exact="true" path="/" element={<HomePage />} />
            <Route exact="true" path="/login" element={<Login />} />
            <Route exact="true" path="/signup" element={<Signup />} />
            <Route exact="true" path="/ownershome" element={<OwnersHomepage />} />
            <Route
              exact="true"
              path="/addInfo"
              element={
                <ProtectedRoute>
                  <AddFoodPlace />
                </ProtectedRoute>
              }
            />
            <Route exact="true" path="/comments/:id" element={<Comments />} />
            <Route exact="true" path="/details/:id" element={<CompleteDetails />} />
            <Route
              exact="true"
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminHome />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Content>
      </BrowserRouter>
    </>
  );
}

export default App;
