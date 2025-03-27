import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import CheckupPage from "./pages/CheckupPage";
import "./App.css";
import domBryanSwag from "./assets/dom-bryan-swag.png";
import domSwag from "./assets/dom-swag.png";
import bryanSwag from "./assets/bryan-swag.png";
import { TimerProvider, useTimer } from "./context/TimerContext";

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

  // Add specific banner class depending on the current path
  const getBannerClass = () => {
    if (location.pathname === "/") {
      return "dom-banner";
    } else if (location.pathname === "/checkups") {
      return "bryan-banner";
    } else {
      return "";
    }
  };

  return (
    <div className="main-banner">
      <h1>Too Fastlist ToDorious</h1>
      <img src={getBanner()} alt="App Banner" className={getBannerClass()} />
    </div>
  );
}

// Navigation component with timer awareness
function Navigation() {
  const { isTimerActive } = useTimer();
  const navigate = useNavigate();
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (isTimerActive) {
      e.preventDefault();
      alert("Please finish or cancel the timer before navigating");
      return;
    }
    navigate(path);
  };
  
  return (
    <nav className={isTimerActive ? "nav-disabled" : ""}>
      <ul>
        <li>
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, "/")}
            className={isTimerActive ? "disabled-link" : ""}
          >
            ToDorious
          </Link>
        </li>
        <li>
          <Link 
            to="/checkups" 
            onClick={(e) => handleNavClick(e, "/checkups")}
            className={isTimerActive ? "disabled-link" : ""}
          >
            Fastlist
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function AppContent() {
  return (
    <>
      <DynamicBanner />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/checkups" element={<CheckupPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <TimerProvider>
        <div className="app-container">
          <Routes>
            <Route path="*" element={<AppContent />} />
          </Routes>
        </div>
      </TimerProvider>
    </Router>
  );
}