import Layout from "@/layout";
import { createBrowserRouter } from "react-router-dom";
import About from "./About";
import Borrowing from "./Borrowing";
import Home from "./Home";
import Notifications from "./Notifications";
import Settings from "./Settings";
import Track from "./Track";
import Accounts from "./accounts";
import NewAccount from "./accounts/new";
import AccountSetup from "./setup/AccountSetup";
import Hello from "./setup/Hello";
import Welcome from "./setup/Welcome";
import SetupLayout from "./setup/SetupLayout";
import Dev from "./dev/dev";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "setup",
        element: <SetupLayout />,
        children: [
          {
            index: true,
            element: <Hello />,
          },
          {
            path: "account",
            element: <AccountSetup />,
          },
          {
            path: "welcome",
            element: <Welcome />,
          },
        ],
      },
      {
        path: "track",
        element: <Track />,
      },
      {
        path: "accounts",
        children: [
          {
            index: true,
            element: <Accounts />,
          },
          {
            path: "new",
            element: <NewAccount />,
          },
        ],
      },
      {
        path: "borrowing",
        element: <Borrowing />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "dev",
        element: <Dev />,
      },
    ],
  },
]);
