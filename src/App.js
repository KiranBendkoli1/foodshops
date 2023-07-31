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
import AdminHome from "./Components/Admin/AdminHome";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { useDispatch } from "react-redux";
import { fetchPlaces } from "./store/placesSlice";
import OwnersHomepage from "./Components/ShopOwener/OwnersHomepage";
import CompleteDetails from "./Components/ShopOwener/CompleteDetails";
import Leaflet from "./Components/UI/Leaflet";
import MapComponent from "./Components/Maps/MapComponent";

const { Header, Content } = Layout;
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPlaces());
    // console.log(foodplaces);
  }, [dispatch]);
  return (
    <>
      <BrowserRouter>
        <Header className={classes.header}>
          <Navbar />
        </Header>
        <Content className={classes.content}>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/ownershome" element={<OwnersHomepage />} />
            <Route
              exact
              path="/addInfo"
              element={
                <ProtectedRoute>
                  <AddFoodPlace />
                </ProtectedRoute>
              }
            />
            <Route exact path="/comments/:id" element={<Comments />} />
            <Route exact path="/details/:id" element={<CompleteDetails />} />
            <Route
              exact
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminHome />
                </ProtectedRoute>
              }
            />

            <Route exact path="/map" element={<Leaflet />} />
            <Route exact path="/gotomap/:lat/:lon/:loc" element={<MapComponent />} />
          </Routes>
        </Content>
      </BrowserRouter>
    </>
  );
}

export default App;
