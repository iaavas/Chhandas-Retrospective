import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./Navbar";
import About from "./About";
import TestChhanda from "./TestChhanda";
import Examples from "./Examples";
import Home from "./Home";
import Footer from "./components/Footer";
export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/test" element={<TestChhanda />} />
          <Route path="/examples" element={<Examples />} />
        </Routes>
        <Footer />
      </Router>
    </LanguageProvider>
  );
}
