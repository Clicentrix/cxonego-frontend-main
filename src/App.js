import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Provider } from "react-redux";
import "./styles/global.css";
import store from "./redux/app/store";
import LayoutComponent from "./components/layout/layoutComponent";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { LoggedOutRouteConfig } from "./routes/RouteConfig";
import { auth } from "./services/firebaseConfig";
import { Spin } from "antd";
import DebugConsole from "./components/debug/DebugConsole";
import DebugViewer from "./components/debug/DebugViewer";
// A global flag to enable/disable debugging tools
const DEBUG_MODE = true;
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    // Add a global error boundary
    useEffect(() => {
        if (DEBUG_MODE) {
            const originalOnError = window.onerror;
            window.onerror = (message, source, lineno, colno, error) => {
                console.error('GLOBAL ERROR CAUGHT:', { message, source, lineno, colno });
                console.error('Error stack:', error?.stack);
                // Call the original handler if it exists
                if (typeof originalOnError === 'function') {
                    return originalOnError(message, source, lineno, colno, error);
                }
                return false;
            };
            // Log app initialization
            console.log('=== DEBUG MODE ENABLED ===');
            console.log('App initialized at:', new Date().toISOString());
            console.log('Press Ctrl+Alt+D to toggle debug console');
            console.log('Press Ctrl+Alt+V to toggle debug viewer');
        }
    }, []);
    useEffect(() => {
        if (localStorage.getItem("loggedIn") === "true") {
            setIsLoggedIn(true);
            setIsLoading(false);
        }
        else {
            setIsLoggedIn(false);
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // setUser(user);
                    const idToken = await user.getIdToken(true);
                    localStorage.setItem("idToken", idToken);
                    localStorage.setItem("loginTimestamp", Date.now().toString());
                    localStorage.setItem("accessToken", idToken);
                }
                else {
                    // setUser(null);
                    localStorage?.clear();
                    setIsLoggedIn(false);
                }
            });
        }, 50 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            const loginTimestamp = localStorage.getItem("loginTimestamp");
            if (loginTimestamp) {
                const currentTime = Date.now();
                const maxSessionTime = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
                // const maxSessionTime = 5 * 60 * 1000; // 1 minute in milliseconds
                if (currentTime - parseInt(loginTimestamp) > maxSessionTime) {
                    alert("Your session is about to expire as it was active for 8 hrs, for security reasons please login again to continue .");
                    auth.signOut();
                    localStorage?.clear();
                    setIsLoggedIn(false);
                    window.location.href = "/login";
                }
                else {
                    console.log("YOU ARE LOGGED IN", currentTime - parseInt(loginTimestamp));
                }
            }
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);
    if (isLoading) {
        // Show a loading screen until localStorage is checked
        return (_jsxs(_Fragment, { children: [_jsx(Spin, { spinning: isLoading, tip: "Loading..." }), DEBUG_MODE && _jsx(DebugConsole, {}), DEBUG_MODE && _jsx(DebugViewer, {})] }));
    }
    else if (!isLoggedIn && !isLoading) {
        return (_jsx(Provider, { store: store, children: _jsxs(BrowserRouter, { children: [_jsx(Spin, { spinning: isLoading, tip: "Loading...", children: _jsx(LoggedOutRouteConfig, {}) }), DEBUG_MODE && _jsx(DebugConsole, {}), DEBUG_MODE && _jsx(DebugViewer, {})] }) }));
    }
    else {
        return (_jsx(_Fragment, { children: _jsx(Provider, { store: store, children: _jsxs(BrowserRouter, { children: [_jsx(Spin, { spinning: isLoading, tip: "Loading...", children: _jsx(LayoutComponent, {}) }), DEBUG_MODE && _jsx(DebugConsole, {}), DEBUG_MODE && _jsx(DebugViewer, {})] }) }) }));
    }
}
export default App;
