import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BasicCard from "./commonComp/cart";
import SearchImages from "./Pages/SearchImages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Fav from "./Pages/fav";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<BasicCard />} />
        <Route path="/searchimages" exact element={<SearchImages />} />
        <Route path="/favourites" exact element={<Fav />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
