import { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import LoadingScreen from "./components/loading-screen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // only login user uses layout element(home,profile...)
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/create-account", element: <CreateAccount /> },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing:border-box;
  }
  body{
    background-color:black;
    color:white;
    font-family:system-ui;
  }
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    // wait for firebase
    setIsLoading(false);
  };

  useEffect(() => {
    setTimeout(() => init(), 2000);
  }, []);

  return (
    <>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
