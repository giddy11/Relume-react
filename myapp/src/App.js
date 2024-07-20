// import { Test } from "@relume_io/relume-ui";
import Test from "./Test";

import "./App.css";
import { Navbar } from "./components/navigationBar/Navbar";
import {Footer} from "./components/footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/test" element={<Test />} />
        {/* Add other routes here */}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
