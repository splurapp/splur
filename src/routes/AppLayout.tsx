import { Outlet, useMatch } from "react-router-dom";

export default function AppLayout() {
  const isSetupRoute = useMatch("/setup/*");

  return (
    <div className={`container relative mx-auto h-[100svh] max-w-lg ${isSetupRoute ? "" : "p-3"}`}>
      <Outlet />
    </div>
  );
}
