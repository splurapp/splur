import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Hello() {
  const installEvent = useRef<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePwaInstall = async () => {
    if (!installEvent.current) {
      return;
    }

    installEvent.current.prompt();
    const result = await installEvent.current.userChoice;
    if (result.outcome === "accepted") {
      setIsModalOpen(false);
      installEvent.current = null;
    } else {
      console.log("Installtion denied!");
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      if ("BeforeInstallPromptEvent" in window) {
        e.preventDefault();
        installEvent.current = e;
        setIsModalOpen(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <main className="p-3 h-screen bg-primary flex flex-col justify-center items-center gap-2">
      <h1 className="text-5xl font-bold italic text-primary-content">Splur.</h1>
      <p className="text-secondary-content text-sm">An open source personal expense manager app</p>
      <Link to="account">
        <button className="btn btn-neutral btn-wide mt-5">Let's Go</button>
      </Link>

      <dialog id="pwa-prompt-modal" className="modal" open={isModalOpen}>
        <div className="modal-box">
          <h1 className="text-2xl mb-2">Install as PWA</h1>
          <p>
            This app is intended to be used as PWA, we recommend to install the app to directly
            launch from home screen, along with many other PWA exclusive feature.
          </p>

          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setIsModalOpen(false);
              installEvent.current = null;
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path
                d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"
                fill="rgba(255,255,255,1)"
              ></path>
            </svg>
          </button>

          <div className="modal-action">
            <button className="btn btn-primary w-full" onClick={handlePwaInstall}>
              Install as PWA
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
