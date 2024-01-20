import type { Wallet } from "@/model/schema";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect } from "react";
import { useFetcher } from "react-router-dom";

interface EditWalletModalProps {
  wallet: Wallet | null;
  onClose: () => void;
}

export default function EditWalletModal({ wallet, onClose }: EditWalletModalProps) {
  const fetcher = useFetcher();
  const { isOpen, onOpenChange } = useDisclosure({ isOpen: !!wallet });

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      onClose();
    }
  }, [fetcher.data, fetcher.state, onClose]);

  if (!wallet) return;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit wallet</ModalHeader>
        <ModalBody>
          <fetcher.Form method="put" className="space-y-3">
            <Input
              type="text"
              name="name"
              id="name"
              defaultValue={wallet.name}
              placeholder="enter wallet name"
              variant="faded"
              size="md"
            />
            <Input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="number"
              min={0}
              name="amount"
              id="amount"
              placeholder="enter amount"
              defaultValue={wallet.amount === 0 ? "" : wallet.amount.toString()}
              variant="faded"
              size="md"
            />
            <input type="hidden" name="id" value={wallet.id} />
            <input type="hidden" name="type" value={wallet.type} />

            <Button type="submit" color="primary" fullWidth size="lg">
              Submit
            </Button>
          </fetcher.Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
