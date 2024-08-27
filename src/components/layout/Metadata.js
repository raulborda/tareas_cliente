import { ClockCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import moment from "moment";
import React from "react";

const Metadata = ({ metadata }) => {
  const {
    up_detalle,
    up_fechaupload,
    up_filename,
    up_size,
    up_vencimiento,
    usu_nombre,
    modori_color,
    modori_desc,
  } = metadata;

  const date = moment(up_fechaupload).format("DD/MM/YYYY");

  return (
    <div className="metadata_wrapper">
      
      <div className="info">
        <div className="title">{up_filename}</div>
        <p className="details">{up_detalle}</p>
        <span>
          {date} | <span>{usu_nombre} | </span> {(up_size / 1024).toFixed(1)}kb
        </span>
        <div className="user_info">
          <div className="user">
            {/* <LockOutlined style={{ marginLeft: 5 }} /> */}
          </div>
        </div>
      </div>



      <div className="tags">
        <Tag
          color={modori_color}
          style={{ marginRight: 0, textTransform: "uppercase" }}
        >
          {modori_desc}
        </Tag>
        {up_vencimiento !== null && (
          <span className="tag_alert">
            <ClockCircleOutlined style={{ marginRight: 5 }} />{" "}
            {moment(up_vencimiento).format("DD/MM/YYYY")}
          </span>
        )}
      </div>

    </div>
  );
};

export default Metadata;
