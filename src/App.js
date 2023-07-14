import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home/HomePage";
import AddFoodPlace from "./Components/Home/AddFoodPlace";
import Navbar from "./Components/UI/Navbar";
import classes from './Components/Home/HomePage.module.css';
import { Layout } from "antd";
import Comments from "./Components/Home/Comments";
const {Header, Content} = Layout;
function App() {
  return (
    <>
      <BrowserRouter>
      <Header className={classes.header}
      >
        <Navbar/>
      </Header>
      <Content className={classes.content}>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/addInfo" element={<AddFoodPlace/>}/>
          <Route exact path="/comments" element={<Comments/>}/>
        </Routes>
        </Content>
      </BrowserRouter>
    </>
  );
}

export default App;
