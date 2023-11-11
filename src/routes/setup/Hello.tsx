import { Link } from "react-router-dom";

// TODO: if not installed add installation setup

export default function Hello() {
  return (
    <main className="p-3 h-screen bg-primary flex flex-col justify-center items-center gap-2">
      <h1 className="text-5xl font-bold italic text-primary-content">Splur.</h1>
      <p className="text-secondary-content text-sm">An open source personal expense manager app</p>
      <Link to="account">
        <button className="btn btn-secondary btn-wide mt-5">Let's Go</button>
      </Link>
    </main>
  );
}
