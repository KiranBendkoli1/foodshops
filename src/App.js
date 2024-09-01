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
import { Provider, useDispatch } from "react-redux";
import { fetchPlaces } from "./store/placesSlice";
import OwnersHomepage from "./Components/ShopOwener/OwnersHomepage";
import CompleteDetails from "./Components/ShopOwener/CompleteDetails";
import MapComponent from "./Components/Maps/MapComponent";
import PrivateRoutes from "./Components/ProtectedRoute/PrivateRoutes";
import ThemeContextProvider, { ThemeContext } from "./context/theme-context";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import store from "./store/store";
const { Header, Content } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

// "test": "react-scripts test --transformIgnorePatterns \"node_modules/(?!axios)/\"",

// const Index = () => {
//   const themeContext = useContext(ThemeContext);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(fetchPlaces());
//   }, [dispatch]);
//   return (
//    )
// }

function App() {
  const themeContext = useContext(ThemeContext);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);
  return <ConfigProvider
    theme={{
      algorithm:
        themeContext.theme === "dark" ? darkAlgorithm : defaultAlgorithm,
    }}
  >
    <div data-theme={themeContext.theme}>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme="colored"
        theme={themeContext.theme}
      ></ToastContainer>
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
            <Route
              exact
              path="/gotomap/:lat/:lon/:loc"
              element={<MapComponent />}
            />
            <Route element={<PrivateRoutes />}>
              <Route exact path="/admin" element={<AdminHome />} />
              <Route exact path="/ownershome" element={<OwnersHomepage />} />
              <Route exact path="/addInfo" element={<AddFoodPlace />} />
            </Route>
          </Routes>
        </Content>
      </BrowserRouter>
    </div>
  </ConfigProvider>
}

export default App;
