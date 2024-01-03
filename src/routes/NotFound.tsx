import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container flex h-[100svh] flex-col items-center justify-center bg-primary">
      <h2 className="mb-2 text-2xl">Nothing to see here!</h2>
      <Link to="/">
        <button className="btn btn-neutral btn-wide">Home</button>
      </Link>
    </main>
  );
}
