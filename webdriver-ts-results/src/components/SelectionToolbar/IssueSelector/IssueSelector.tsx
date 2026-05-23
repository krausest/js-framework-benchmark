import IssueSelectorList from "./IssueSelectorList";
import { Button, Modal } from "antd";
import { useState, useEffect } from "react";

const content = <IssueSelectorList />;

const IssueSelector = () => {
  console.log("IssueSelector");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.removeProperty("overflow");
    }
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
        Which issues?
      </Button>
      <Modal title="Issues selector" footer={null} onOk={handleOk} onCancel={handleCancel} open={isModalOpen}>
        {content}
      </Modal>
    </>
  );
};

export default IssueSelector;
