import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="container relative mx-auto h-[100svh] max-w-lg p-3">
      <Outlet />
    </div>
  );
}
