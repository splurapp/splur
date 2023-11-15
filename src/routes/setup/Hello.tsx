import { Link } from "react-router-dom";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

// TODO: if not installed add installation setup

export default function Hello() {
  const [upi, setUpi] = useState("");
  const [err, setErr] = useState("");

  return (
    <main className="p-3 h-screen bg-primary flex flex-col justify-center items-center gap-2">
      <h1 className="text-5xl font-bold italic text-primary-content">Splur.</h1>
      <p className="text-secondary-content text-sm">An open source personal expense manager app</p>
      <Link to="account">
        <button className="btn btn-secondary btn-wide mt-5">Let's Go</button>
      </Link>
      {!upi ? (
        <QrScanner
          onDecode={result => {
            setUpi(result);
            console.log(result);
          }}
          onError={error => {
            console.log(error?.message);
            setErr(error?.message);
          }}
          containerStyle={{ width: "80%", height: "80%" }}
        />
      ) : null}
      {upi ? (
        <a className="btn btn-secondary btn-wide" href={upi}>
          Pay
        </a>
      ) : null}
      {err ? <p>error: {err}</p> : null}
    </main>
  );
}
