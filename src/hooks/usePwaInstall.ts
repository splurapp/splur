import { useCallback, useEffect, useRef, useState } from "react";

interface UsePwaInstallProps {
  onAccepted?: () => void;
  onDeny?: () => void;
}

export const usePwaInstall = ({ onAccepted, onDeny }: UsePwaInstallProps) => {
  const installEvent = useRef<BeforeInstallPromptEvent | null>(null);
  const [isReadToInstall, setIsReadToInstall] = useState<boolean>(false);

  /**
   * Prompt to install the PWA
   */
  const installPWA = useCallback(async () => {
    if (!installEvent.current) {
      return;
    }

    await installEvent.current.prompt();
    const result = await installEvent.current.userChoice;
    if (result.outcome === "accepted") {
      setIsReadToInstall(false);
      installEvent.current = null;
      onAccepted?.();
    } else {
      onDeny?.();
    }
  }, [onDeny, onAccepted]);

  /**
   * Set the install set to closed and remove installEvent
   */
  const onClose = useCallback(() => {
    setIsReadToInstall(false);
    installEvent.current = null;
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      if ("BeforeInstallPromptEvent" in window) {
        e.preventDefault();
        installEvent.current = e as BeforeInstallPromptEvent;
        setIsReadToInstall(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return { isReadToInstall, installPWA, onClose };
};
