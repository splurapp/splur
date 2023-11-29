import { isInitialSetupDone } from "@/lib/app";
import { createBrowserRouter, redirect } from "react-router-dom";
import About from "./About";
import Borrowing from "./Borrowing";
import Home from "./Home";
import Notifications from "./Notifications";
import Settings from "./Settings";
import Track from "./Track";
import Accounts from "./accounts";
import NewAccount from "./accounts/new";
import Dev from "./dev/Dev";
import AccountSetup from "./setup/AccountSetup";
import Hello from "./setup/Hello";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <Home />,
        loader: async () => {
          if (!isInitialSetupDone()) {
            return redirect("/setup");
          }
          return null;
        },
      },
      {
        path: "setup",
        loader: async () => {
          if (isInitialSetupDone()) {
            return redirect("/");
          }
          return null;
        },
        children: [
          {
            index: true,
            element: <Hello />,
          },
          {
            path: "account",
            element: <AccountSetup />,
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
