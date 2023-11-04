import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Layout from "@/layout";
import Track from "./Track";
import Settings from "./Settings";
import Accounts from "./Accounts";
import Setup from "./Setup";
import Borrowing from "./Borrowing";
import Notifications from "./Notifications";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/setup",
        element: <Setup />,
      },
      {
        path: "/track",
        element: <Track />,
      },
      {
        path: "/accounts",
        element: <Accounts />,
      },
      {
        path: "/borrowing",
        element: <Borrowing />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
]);
