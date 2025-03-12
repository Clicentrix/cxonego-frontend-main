import { Provider } from "react-redux";
import "./styles/global.css";
import store from "./redux/app/store";
import LayoutComponent from "./components/layout/layoutComponent";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { LoggedOutRouteConfig } from "./routes/RouteConfig";
import { auth } from "./services/firebaseConfig";
import { Spin } from "antd";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      setIsLoggedIn(true);
      setIsLoading(false);
    } else {
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
        } else {
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
          alert(
            "Your session is about to expire as it was active for 8 hrs, for security reasons please login again to continue ."
          );
          auth.signOut();
          localStorage?.clear();
          setIsLoggedIn(false);
          window.location.href = "/login";
        } else {
          console.log(
            "YOU ARE LOGGED IN",
            currentTime - parseInt(loginTimestamp)
          );
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    // Show a loading screen until localStorage is checked
    return <Spin spinning={isLoading} tip="Loading..."></Spin>;
  }

  else if (!isLoggedIn && !isLoading) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Spin spinning={isLoading} tip="Loading...">
            <LoggedOutRouteConfig />
          </Spin>
        </BrowserRouter>
      </Provider>
    );
  } else {
    return (
      <>
        <Provider store={store}>
          <BrowserRouter>
            <Spin spinning={isLoading} tip="Loading...">
              <LayoutComponent />
            </Spin>
          </BrowserRouter>
        </Provider>
      </>
    );
  }
}

export default App;
