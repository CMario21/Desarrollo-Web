import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Curso1 from "./pages/Curso1";
import Curso2 from "./pages/Curso2";
import Curso3 from "./pages/Curso3";
import Curso4 from "./pages/Curso4";
import Curso5 from "./pages/Curso5";


function App() {
  return (
    <Router>
      <NavbarComponent />
      <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curso1" element={<Curso1 />} />
            <Route path="/curso2" element={<Curso2 />} />
            <Route path="/curso3" element={<Curso3 />} />
            <Route path="/curso4" element={<Curso4 />} />
            <Route path="/curso5" element={<Curso5 />} />
          </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App
