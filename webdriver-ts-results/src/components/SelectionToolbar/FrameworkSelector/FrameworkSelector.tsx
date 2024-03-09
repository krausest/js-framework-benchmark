import { FrameworkType } from "@/Common";
import FrameworkSelectorCategory from "./FrameworkSelectorCategory";

import { useState, useEffect } from "react";
import { Button, Modal } from "antd";

const content = (
  <>
    <FrameworkSelectorCategory frameworkType={FrameworkType.KEYED} label="Keyed frameworks:" />
    <FrameworkSelectorCategory frameworkType={FrameworkType.NON_KEYED} label="Non-keyed frameworks:" />
  </>
);

const FrameworkSelector = () => {
  console.log("FrameworkSelector");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    isModalOpen ? (document.body.style.overflow = "hidden") : document.body.style.removeProperty("overflow");
  }, [isModalOpen]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Which frameworks?
      </Button>
      <Modal
        width={"90%"}
        title="Frameworks selector"
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {content}
      </Modal>
    </>
  );
};

export default FrameworkSelector;
