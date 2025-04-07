import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TimerProvider, useTimer, isTimerActive } from "./context/TimerContext";
import TodoPage from "./pages/TodoPage";
import ChecklistPage from "./pages/ChecklistPage";
import ErrorBoundary from "./components/ErrorBoundary";
import domSwag from "./assets/dom-swag.png";
import bryanSwag from "./assets/bryan-swag.png";
import domBryanSwag from "./assets/dom-bryan-swag.png";
import "./App.css";


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
      <h1>Too Fast Todorious</h1>
      <img src={getBanner()} alt="Too Fast Todorious Banner" />
    </div>
  );
}

function Navigation() {
  const { timerStatus } = useTimer();
  const timerIsActive = isTimerActive(timerStatus);

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <nav className={timerIsActive ? "nav-disabled" : ""}>
        <ul>
          <li>
            <Link
              to="/"
              onClick={() => navigate("/")}
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
              onClick={() => navigate("/brian-checks")}
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

function Footer() {
  return (
    <footer className="app-footer">
      <p><i>empatiempatie ©</i></p>
    </footer>
  );
}

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
              <ErrorBoundary fallback={<div>Sorry, something went wrong with Dom.</div>}>
                <TodoPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/brian-checks"
            element={
              <ErrorBoundary fallback={<div>Sorry, something went wrong with Brian.</div>}>
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