import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Hello() {
  const navigate = useNavigate();
  const installEvent = useRef<BeforeInstallPromptEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpenChange } = useDisclosure({ isOpen: isModalOpen });

  const handlePwaInstall = async () => {
    if (!installEvent.current) {
      return;
    }

    await installEvent.current.prompt();
    const result = await installEvent.current.userChoice;
    if (result.outcome === "accepted") {
      setIsModalOpen(false);
      installEvent.current = null;
      if (/Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        navigate("/install-done");
      }
    } else {
      console.log("Installation denied!");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    installEvent.current = null;
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      if ("BeforeInstallPromptEvent" in window) {
        e.preventDefault();
        installEvent.current = e as BeforeInstallPromptEvent;
        setIsModalOpen(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <main className="flex h-[100svh] flex-col items-center justify-center gap-2">
      <h1 className="text-5xl font-bold italic">Splur.</h1>
      <p className="text-sm">An open source personal expense manager app</p>
      <Link to="account">
        <Button size="lg" color="primary" className="mt-5">
          Let's Go
        </Button>
      </Link>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Installation</ModalHeader>
          <ModalBody>
            <p>
              This app is intended to be used as standalone app, we recommend installing the app to
              directly launch from home screen, along with many other exclusive feature.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" fullWidth onPress={() => void handlePwaInstall()}>
              Add to homescreen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
