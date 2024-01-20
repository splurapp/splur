import { usePwaInstall } from "@/hooks/usePwaInstall";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

export default function Hello() {
  const navigate = useNavigate();
  const { installPWA, onClose, isReadToInstall } = usePwaInstall({
    onAccepted: () => {
      if (/Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        navigate("/install-done");
      }
    },
  });
  const { isOpen, onOpenChange } = useDisclosure({ isOpen: isReadToInstall });

  return (
    <main className="flex h-[100svh] flex-col items-center justify-center gap-2">
      <h1 className="text-5xl font-bold italic">Splur.</h1>
      <p className="text-sm">An open source personal expense manager app</p>
      <Link to="account">
        <Button size="lg" variant="shadow" color="primary" className="mt-5">
          Let's Go
        </Button>
      </Link>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" onClose={onClose}>
        <ModalContent>
          <ModalHeader>Installation</ModalHeader>
          <ModalBody>
            <p>
              This app is intended to be used as standalone app, we recommend installing the app to
              directly launch from home screen, along with many other exclusive feature.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" fullWidth onPress={() => void installPWA()}>
              Add to homescreen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
