import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance.jsx";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/attendance"
          element={token ? <Attendance /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
