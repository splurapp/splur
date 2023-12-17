import { isInitialSetupDone } from "@/lib/app";
import { createBrowserRouter, redirect } from "react-router-dom";
import About from "./About";
import AppLayout from "./AppLayout";
import Borrowing from "./Borrowing";
import LayoutWithNav from "./LayoutWithNav";
import Notifications from "./Notifications";
import PWAInstallDone from "./PWAInstallDone";
import Reports from "./Reports";
import Settings from "./Settings";
import Accounts from "./accounts";
import NewAccount from "./accounts/new";
import Dev from "./dev/Dev";
import Home from "./home";
import { loader as transactionLoader } from "./home/home.service";
import AccountSetup from "./setup/AccountSetup";
import Hello from "./setup/Hello";
import { action as walletAction, loader as walletLoader } from "./setup/account-setup.service";
import Track from "./track";
import { action as trackAction, loader as trackLoader } from "./track/track.service";

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
        element: <AppLayout />,
        children: [
          {
            element: <LayoutWithNav />,
            children: [
              {
                index: true,
                element: <Home />,
                loader: transactionLoader,
              },
              {
                path: "reports",
                element: <Reports />,
              },
              {
                path: "settings",
                element: <Settings />,
              },
            ],
          },
          {
            path: "track/:id?",
            element: <Track />,
            loader: trackLoader,
            action: trackAction,
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
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "about",
            element: <About />,
          },
          {
            path: "install-done",
            element: <PWAInstallDone />,
          },
        ],
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
            action: walletAction,
          },
        ],
      },
    ],
  },
  {
    path: "dev",
    element: <Dev />,
  },
]);
