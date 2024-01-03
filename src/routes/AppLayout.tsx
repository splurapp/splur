import { NextUIProvider } from "@nextui-org/react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const isSetupRoute = useMatch("/setup/*");
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <div
        className={`container relative mx-auto h-[100svh] max-w-lg ${isSetupRoute ? "" : "p-3"}`}
      >
        <Outlet />
      </div>
    </NextUIProvider>
  );
}
