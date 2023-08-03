import { useContext, useEffect } from "react";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home/HomePage";
import AddFoodPlace from "./Components/ShopOwener/AddFoodPlace";
import Navbar from "./Components/UI/Navbar";
import classes from "./Components/Home/HomePage.module.css";
import { Layout, theme, ConfigProvider } from "antd";
import Comments from "./Components/Home/Comments";
import AdminHome from "./Components/Admin/AdminHome";
// import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { useDispatch } from "react-redux";
import { fetchPlaces } from "./store/placesSlice";
import OwnersHomepage from "./Components/ShopOwener/OwnersHomepage";
import CompleteDetails from "./Components/ShopOwener/CompleteDetails";
// import Leaflet from "./Components/UI/Leaflet";
import MapComponent from "./Components/Maps/MapComponent";
import PrivateRoutes from "./Components/ProtectedRoute/PrivateRoutes";
import { ThemeContext } from "./context/theme-context";
import "./index.css";
const { Header, Content } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;
function App() {
  const themeContext = useContext(ThemeContext);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(themeContext.theme);
    dispatch(fetchPlaces());
  }, [dispatch]);
  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeContext.theme === "dark" ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <div 
       data-theme={themeContext.theme} 
      >
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Header className={classes.header}>
          <Navbar />
        </Header>
        <Content className={`${classes.content} bg`}>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/comments/:id" element={<Comments />} />
            <Route exact path="/details/:id" element={<CompleteDetails />} />
            <Route element={<PrivateRoutes />}>
              <Route exact path="/admin" element={<AdminHome />} />
              <Route exact path="/ownershome" element={<OwnersHomepage />} />
              <Route exact path="/addInfo" element={<AddFoodPlace />} />
              <Route
                exact
                path="/gotomap/:lat/:lon/:loc"
                element={<MapComponent />}
              />
            </Route>
          </Routes>
        </Content>
      </BrowserRouter>
      </div>
    </ConfigProvider>
  );
}

export default App;
