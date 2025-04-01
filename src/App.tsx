import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { TimerProvider, useTimer, isTimerActive } from "./context/TimerContext";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import TodoPage from "./pages/TodoPage";
import ChecklistPage from "./pages/ChecklistPage";
import "./App.css";
import domBryanSwag from "./assets/dom-bryan-swag.png";
import domSwag from "./assets/dom-swag.png";
import bryanSwag from "./assets/bryan-swag.png";

function DynamicBanner() {
  const location = useLocation();
  const getBanner = () => {
    if (location.pathname === "/brian-checks") {
      return bryanSwag;
    } else if (location.pathname === "/") {
      return domSwag;
    } else {
      return domBryanSwag;
    }
  };

  return (
    <div className="main-banner">
      <h1>Too Fastlist Todorious</h1>
      <img src={getBanner()} alt="Too Fastlist Todorious Banner" />
    </div>
  );
}

// Navigation component with timer awareness
function Navigation() {
  const { timerStatus } = useTimer();
  const timerIsActive = isTimerActive(timerStatus);

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (timerIsActive) {
      e.preventDefault();
      alert("Please finish or cancel the timer before navigating");
      return;
    }
    navigate(path);
  };

  return (
    <>
      <nav className={timerIsActive ? "nav-disabled" : ""}>
        <ul>
          <li>
            <Link
              to="/"
              onClick={(e) => handleNavClick(e, "/")}
              className={`
                ${timerIsActive ? "disabled-link" : ""} 
                ${location.pathname === "/" ? "active" : ""}
              `}
            >
              Dom Does
            </Link>
          </li>
          <li>
            <Link
              to="/brian-checks"
              onClick={(e) => handleNavClick(e, "/brian-checks")}
              className={`
                ${timerIsActive ? "disabled-link" : ""} 
                ${location.pathname === "/brian-checks" ? "active" : ""}
              `}
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
          <Route
            path="/"
            element={
              <ErrorBoundary
                fallback={
                  <div>Sorry, something went wrong with the Dom Does page.</div>
                }
              >
                <TodoPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/brian-checks"
            element={
              <ErrorBoundary
                fallback={
                  <div>Sorry, something went wrong with the Brian Checks page.</div>
                }
              >
                <ChecklistPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="*"
            element={
              <ErrorBoundary fallback={<div>404 - Page not found</div>}>
                <NotFound />
              </ErrorBoundary>
            }
          />
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