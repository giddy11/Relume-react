// import { Test } from "@relume_io/relume-ui";
import Test from "./Test";

import "./App.css";
import { Navbar } from "./components/NavigationBar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Test />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
