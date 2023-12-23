import type { LoaderFunctionArgs } from "react-router-dom";
import { Route, createBrowserRouter, createRoutesFromElements, redirect } from "react-router-dom";
import { isInitialSetupDone } from "../lib/app";
import About from "./About";
import AppLayout from "./AppLayout";
import Borrowing from "./Borrowing";
import LayoutWithNav from "./LayoutWithNav";
import NotFound from "./NotFound";
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

// This is a root loader that redirects to setup if the app is not setup yet.
function rootLoader({ request }: LoaderFunctionArgs<unknown>) {
  const isSetupDone = isInitialSetupDone();
  if (request.url.includes("/setup")) {
    return isSetupDone ? redirect("/") : null;
  } else if (!isSetupDone) {
    return redirect("/setup");
  } else {
    return null;
  }
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AppLayout />} loader={rootLoader}>
        <Route element={<LayoutWithNav />}>
          <Route index element={<Home />} loader={transactionLoader} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="track/:id?" element={<Track />} loader={trackLoader} action={trackAction} />
        <Route path="accounts">
          <Route index element={<Accounts />} />
          <Route path="new" element={<NewAccount />} />
        </Route>
        <Route path="borrowing" element={<Borrowing />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="about" element={<About />} />
        <Route path="install-done" element={<PWAInstallDone />} />
        <Route path="setup">
          <Route index element={<Hello />} />
          <Route
            path="account"
            element={<AccountSetup />}
            loader={walletLoader}
            action={walletAction}
          />
        </Route>
      </Route>

      <Route path="dev" element={<Dev />} />
      <Route path="*" element={<NotFound />} />
    </>,
  ),
);
