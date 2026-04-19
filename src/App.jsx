import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomLayout from "./Components/UI/CustomLayout";
import { useDispatch } from "react-redux";
import { fetchPlaces } from "./store/placesSlice";
import "./index.css";

const HomePage = lazy(() => import("./Components/Home/HomePage"));
const OffersFeed = lazy(() => import("./Components/Home/OffersFeed"));
const Login = lazy(() => import("./Components/Auth/Login"));
const Signup = lazy(() => import("./Components/Auth/Signup"));
const Comments = lazy(() => import("./Components/Home/Comments"));
const CompleteDetails = lazy(() => import("./Components/ShopOwener/CompleteDetails"));
const PrivateRoutes = lazy(() => import("./Components/ProtectedRoute/PrivateRoutes"));
const AdminHome = lazy(() => import("./Components/Admin/AdminHome"));
const OwnersHomepage = lazy(() => import("./Components/ShopOwener/OwnersHomepage"));
const AddFoodPlace = lazy(() => import("./Components/ShopOwener/AddFoodPlace"));
const MapComponent = lazy(() => import("./Components/Maps/MapComponent"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CustomLayout>
        <Suspense fallback={<div className="pageLoader">Loading...</div>}>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/offers" element={<OffersFeed />} />
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
        </Suspense>
      </CustomLayout>
    </BrowserRouter>
  );
}

export default App;
