import { BenchmarkType } from "@/Common";
import BenchmarkSelectorCategory from "./BenchmarkSelectorCategory";
import { Button, Modal } from "antd";
import { useState } from "react";

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
      <Modal title="Benchmarks selector" onOk={handleOk} onCancel={handleCancel} open={isModalOpen} footer={null}>
        {content}
      </Modal>
    </>
  );
};

export default BenchmarkSelector;
