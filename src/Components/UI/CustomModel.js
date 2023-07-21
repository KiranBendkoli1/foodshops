import { Modal } from "antd";
import React from "react";

const CustomModel = (props) => {
  return (
    <Modal
      title={props.title}
      open={props.isModalOpen}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
    >
      {props.children}
    </Modal>
  );
};

export default CustomModel;
