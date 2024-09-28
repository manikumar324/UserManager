import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./Components/AdminLogin";
import DashBoard from "./Components/Dashboard";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<AdminLogin />} />
          <Route exact path="/Dashboard" element={<DashBoard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;