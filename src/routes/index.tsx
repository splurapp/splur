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
import { loader as walletLoader } from "./setup/walletLoader";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: ({ request }) => {
      const isSetupDone = isInitialSetupDone();
      if (request.url.includes("/setup")) {
        return isSetupDone ? redirect("/") : null;
      } else if (!isSetupDone) {
        return redirect("/setup");
      } else {
        return null;
      }
    },
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "setup",
        children: [
          {
            index: true,
            element: <Hello />,
          },
          {
            path: "account",
            element: <AccountSetup />,
            loader: walletLoader,
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
    ],
  },
  {
    path: "dev",
    element: <Dev />,
  },
]);
