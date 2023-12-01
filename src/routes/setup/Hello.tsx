import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Hello() {
  const installEvent = useRef<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePwaInstall = async () => {
    if (!installEvent.current) {
      return;
    }

    // @ts-ignore
    installEvent.current.prompt();
    // @ts-ignore
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
    <main className="flex h-[100dvh] flex-col items-center justify-center gap-2 bg-primary">
      <h1 className="text-5xl font-bold italic text-primary-content">Splur.</h1>
      <p className="text-sm text-secondary-content">An open source personal expense manager app</p>
      <Link to="account">
        <button className="btn btn-neutral btn-wide mt-5">Let's Go</button>
      </Link>

      <dialog id="pwa-prompt-modal" className="modal modal-bottom" open={isModalOpen}>
        <div className="modal-box">
          <h1 className="mb-2 text-2xl">Installation</h1>
          <p>
            This app is intended to be used as standalone app, we recommend installing the app to
            directly launch from home screen, along with many other exclusive feature.
          </p>

          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={() => {
              setIsModalOpen(false);
              installEvent.current = null;
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path
                d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>

          <div className="modal-action">
            <button className="btn btn-primary w-full" onClick={handlePwaInstall}>
              Add to homescreen
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
