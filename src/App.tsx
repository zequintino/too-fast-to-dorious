import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import CheckupPage from "./pages/CheckupPage";
import "./App.css";
import domBryanSwag from "./assets/dom-bryan-swag.png";
import domSwag from "./assets/dom-swag.png";
import bryanSwag from "./assets/bryan-swag.png";

// Banner component that changes based on route
function DynamicBanner() {
  const location = useLocation();
  
  // Choose the banner based on the current path
  const getBanner = () => {
    if (location.pathname === "/checkups") {
      return bryanSwag;
    } else if (location.pathname === "/") {
      return domSwag;
    } else {
      return domBryanSwag; // Default fallback
    }
  };

  return (
    <div className="main-banner">
      <h1>Too Fast ToDorious</h1>
      <img src={getBanner()} alt="App Banner" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="*" element={
            <>
              <DynamicBanner />
              <nav>
                <ul>
                  <li>
                    <Link to="/">Todo List</Link>
                  </li>
                  <li>
                    <Link to="/checkups">Home Checkups</Link>
                  </li>
                </ul>
              </nav>
              <main>
                <Routes>
                  <Route path="/" element={<TodoPage />} />
                  <Route path="/checkups" element={<CheckupPage />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}