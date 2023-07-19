import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
const MyModal = () => {
  const error = useSelector((state) => state.places.error);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    console.log({error})
    if (error) {
      setIsModalOpen(true);
    }
  }, [error]);
  return (
    <>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};
export default MyModal;
