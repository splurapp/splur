import { useEffect, useState } from "react";

export default function PWAInstallDone() {
  const [installing, setInstalling] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInstalling(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <main className="flex h-[100dvh] w-full flex-col items-center justify-center bg-primary px-3">
      <div className="card border border-primary-content shadow-xl">
        <div className="card-body">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-16 w-16 text-primary-content"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h2 className="card-title">PWA Installation Successful</h2>
          <p>
            Congratulations! The Progressive Web App has been successfully installed on your device.
            You can now access it from your home screen.
          </p>
          <div className="card-actions">
            <a
              className={`btn btn-neutral w-full ${installing ? "disabled" : ""}`}
              href={window.location.origin}
              target="_blank"
            >
              {installing && <span className="loading loading-dots" />}
              {installing ? "Installing" : "Open PWA"}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
