import { BenchmarkType } from "@/Common";
import BenchmarkSelectorCategory from "./BenchmarkSelectorCategory";
import { Button, Modal } from "antd";
import { useState, useEffect } from "react";

const content = (
  <>
    <BenchmarkSelectorCategory benchmarkType={BenchmarkType.CPU} label="Duration" />
    <BenchmarkSelectorCategory benchmarkType={BenchmarkType.STARTUP} label="Startup" />
    <BenchmarkSelectorCategory benchmarkType={BenchmarkType.MEM} label="Memory" />
  </>
);

const BenchmarkSelector = () => {
  console.log("BenchmarkSelector");

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
        Which benchmarks?
      </Button>
      <Modal title="Benchmarks selector" footer={null} onOk={handleOk} onCancel={handleCancel} open={isModalOpen}>
        {content}
      </Modal>
    </>
  );
};

export default BenchmarkSelector;
