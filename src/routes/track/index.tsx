import { ExchangeType } from "@/model/schema";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import type { z } from "zod";
import TrackerForm from "./TrackerForm";
import type { LoaderData } from "./track.service";

export default function Track() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fetcher = useFetcher<{ error?: string }>();
  const data = useLoaderData() as LoaderData;
  const [exchangeType, setExchangeType] = useState<z.infer<typeof ExchangeType>>(
    data?.transaction?.exchangeType ?? ExchangeType.enum.Expense,
  );

  return (
    <main>
      <Tabs
        fullWidth
        color="primary"
        size="md"
        selectedKey={exchangeType}
        onSelectionChange={key => setExchangeType(ExchangeType.parse(key))}
      >
        {[ExchangeType.enum.Income, ExchangeType.enum.Expense, ExchangeType.enum.Transfer].map(
          type => (
            <Tab
              isDisabled={
                data.transaction?.exchangeType === "Transfer" &&
                (type === "Expense" || type === "Income")
              }
              key={type}
              title={type}
            >
              <TrackerForm exchangeType={exchangeType} data={data} />
            </Tab>
          ),
        )}
      </Tabs>

      {data.transaction ? (
        <Button
          color="danger"
          fullWidth
          variant="bordered"
          isDisabled={fetcher.state === "submitting"}
          onPress={onOpen}
        >
          Delete
        </Button>
      ) : null}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader></ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this ?</p>
              </ModalBody>
              <ModalFooter className="flex flex-col gap-2">
                <Button color="danger" fullWidth variant="flat" onPress={onClose}>
                  Nah
                </Button>
                <Button
                  fullWidth
                  color="primary"
                  onPress={() => {
                    fetcher.submit(null, { method: "DELETE" });
                    onClose();
                  }}
                >
                  I'm sure
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
