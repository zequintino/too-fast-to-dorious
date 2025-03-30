import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import CheckupPage from "./pages/CheckupPage";
import "./App.css";
// Import the font CSS file to ensure it's loaded
import "./fonts/fonts.css";
import domBryanSwag from "./assets/dom-bryan-swag.png";
import domSwag from "./assets/dom-swag.png";
import bryanSwag from "./assets/bryan-swag.png";
import { TimerProvider, useTimer } from "./context/TimerContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect } from "react";

// Banner component that changes based on route
function DynamicBanner() {
  const location = useLocation();

  // Choose the banner based on the current path
  const getBanner = () => {
    if (location.pathname === "/brian-checks") {
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
    } else if (location.pathname === "/brian-checks") {
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
  const location = useLocation();
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
    <>
      <nav className={isTimerActive ? "nav-disabled" : ""}>
        <ul>
          <li>
            <Link
              to="/"
              onClick={(e) => handleNavClick(e, "/")}
              className={`${isTimerActive ? "disabled-link" : ""} ${location.pathname === "/" ? "active" : ""}`}
            >
              Dom Does
            </Link>
          </li>
          <li>
            <Link
              to="/brian-checks"
              onClick={(e) => handleNavClick(e, "/brian-checks")}
              className={`${isTimerActive ? "disabled-link" : ""} ${location.pathname === "/brian-checks" ? "active" : ""}`}
            >
              Brian Checks
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="app-footer">
      <p><i>empatiempatie ©</i></p>
    </footer>
  );
}

// NotFound component that throws an error for invalid routes
function NotFound() {
  useEffect(() => {
    throw new Error("Route not found");
  }, []);
  return null; // This won't render as the error is thrown in useEffect
}

function AppContent() {
  return (
    <>
      <DynamicBanner />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={
            <ErrorBoundary fallback={<div>Sorry, something went wrong with the ToDorious page.</div>}>
              <TodoPage />
            </ErrorBoundary>
          } />
          <Route path="/brian-checks" element={
            <ErrorBoundary fallback={<div>Sorry, something went wrong with the Fastlist page.</div>}>
              <CheckupPage />
            </ErrorBoundary>
          } />
          {/* Catch-all route for invalid paths */}
          <Route path="*" element={
            <ErrorBoundary fallback={<div>404 - Page not found</div>}>
              <NotFound />
            </ErrorBoundary>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <TimerProvider>
          <div className="app-container">
            <Routes>
              <Route path="*" element={<AppContent />} />
            </Routes>
          </div>
        </TimerProvider>
      </ErrorBoundary>
    </Router>
  );
}