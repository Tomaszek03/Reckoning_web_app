import NavBar from "./components/NavBar";
import Calculate from "./pages/CalculatePage";
import History from "./pages/HistoryPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Calculate />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
