/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useQuery, useMutation } from "@apollo/client";
import { Card, Col, DatePicker, Form, Input, Row, Tag, TimePicker, List, Skeleton, Popconfirm, Button } from "antd";
import { TaskContext } from "../../context/TaskContext";
import { GET_ORIGENES } from "../../graphql/query/origenes";
import { GET_TIPO_TAREA } from "../../graphql/query/tipoTareas";
import { GET_USUARIOS } from "../../graphql/query/usuarios";
import {
  DeleteOutlined,
  DownloadOutlined,
  CheckOutlined
} from "@ant-design/icons";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import returnExtIcon from "../../utils/returnExtIcon";
import "./index.css";
import { ELIMINAR_ARCHIVO } from "../../graphql/mutation/deleteFile";
import Metadata from "../layout/Metadata";
import '../layout/metadata.css';
import OpenNotification from "../notification/OpenNotification";
import { DELETE_UPLOAD_TAREA } from "../../graphql/mutation/upload";

const SeeTaskForm = ({ task, queryPoll }) => {
  const [form] = Form.useForm();

  const { setTaskDrawerVisible } = useContext(TaskContext);
  const [origenes, setOrigenes] = useState([]);
  const [tipoTareas, setTipoTareas] = useState([]);
  const [tagColor, setTagColor] = useState("green");

  const [loadingFile, setLoadingFile] = useState(false);
  const [deleteArchivo, setDeleteArchivo] = useState(false); 

  const { data: dataTipoTareas } = useQuery(GET_TIPO_TAREA, {
    variables: { idCategoria: 1 },
  });
  const { data: dataOrigenes } = useQuery(GET_ORIGENES);

  useEffect(() => {
    if (dataTipoTareas) {
      setTipoTareas(dataTipoTareas.getTiposTareaResolver);
      //console.log(tipoTareas)
    }
    if (dataOrigenes) {
      setOrigenes(dataOrigenes.getOrigenesResolver);
      //console.log(origenes)
    }

    switch (true) {
      case task.pri_id === 1:
        setTagColor("red");
        break;
      case task.pri_id === 2:
        setTagColor("gold");
        break;
      case task.pri_id === 3:
        setTagColor("green");
        break;
      default:
        break;
    }
  }, [dataOrigenes, dataTipoTareas]);


  const [deleteUploadDeTareaIframeResolver] = useMutation(DELETE_UPLOAD_TAREA, {
    onCompleted: () => {
      if (queryPoll) {
        const { startPolling, stopPolling } = queryPoll;

        startPolling(1000);

        setTimeout(() => {
          stopPolling();
        }, 1000);
      }
      OpenNotification(
        <h4>Archivo eliminado exitosamente</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
      setDeleteArchivo(true);
    },
  });

  // const [deleteUploadFileResolver] = useMutation(ELIMINAR_ARCHIVO, {
  //   onCompleted: () => {
  //     if (queryPoll) {
  //       const { startPolling, stopPolling } = queryPoll;

  //       startPolling(1000);

  //       setTimeout(() => {
  //         stopPolling();
  //       }, 1000);
  //     }
  //     OpenNotification(
  //       <h4>Archivo eliminado exitosamente</h4>,
  //       null,
  //       "topleft",
  //       <CheckOutlined style={{ color: "green" }} />,
  //       null
  //     );
  //     //setTaskDrawerVisible({ visible: false, content: "" });
  //     setDeleteArchivo(true);
  //   },
  // });


  const PORT = 4001; // siempre corre en este puerto
  const PROTOCOL = window.location.protocol;
  const HOSTNAME = window.location.hostname;
  const FOLDER = "static";

  const handleClick = (item) => {
    //Servidor local: para hacer pruebas en local
    //window.open(`http://beeapp.binamics.com.ar:4001/static?file=${item.up_hashname}`, '_blank');

    // Producción: para producción.
    window.open(
      `${PROTOCOL}//${HOSTNAME}:${PORT}/${FOLDER}?file=${item.up_hashname}`,
      "_blank"
    );
  };



  const eliminarArchivo = async (item) => {
    //console.log('relacion a eliminar', item)
    // Apollo
    deleteUploadDeTareaIframeResolver({
      variables: { idTarea: item.tar_id },
    }).then(() => {
      // setExisteUpload(false);
      // form.resetFields(["nombreUpload"]);
    });

  };

  // console.log('task', task)

  return (
    <Row>
      <Col
        xs={24}
        style={{ justifyContent: "center", overflowX: "hidden" }}
        className="form-ver-tarea"
      >
        <Form
          //disabled={true}
          form={form}
          //requiredMark="optional"
          name="seeTaskForm"
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Cliente"
            name="cliente"
            initialValue={task.cli_nombre}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Input value={task.cli_nombre} />
          </Form.Item>

          {task.con_nombre && (
            <Form.Item
              label="Contacto"
              name="contacto"
              required
              initialValue={task.con_nombre}
            >
              <Input value={task.con_nombre} />
            </Form.Item>
          )}

          <Form.Item
            label="Asunto"
            name="tar_asunto"
            initialValue={task.tar_asunto}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Input value={task.tar_asunto} />
          </Form.Item>

          <Form.Item
            label="Tipo de tarea"
            name="tip_id"
            initialValue={task.tip_desc}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Input value={task.tip_desc} />
          </Form.Item>

          <Form.Item
            label="Fuente"
            name="fuente"
            initialValue={task.ori_id}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <span>
              <Tag color={task.ori_color}>{task.ori_desc} </Tag>
            </span>
          </Form.Item>

          <Row>
            <Col xs={24}>
              <div className="date_wrapper">
                <Col xs={11}>
                  <Form.Item
                    label="Vencimiento"
                    name="tar_vencimiento"
                    initialValue={moment(task.tar_vencimiento, "YYYY-MM-DD")}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      value={moment(task.tar_vencimiento, "YYYY-MM-DD")}
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
                {task.tar_horavencimiento && (
                  <Col xs={6}>
                    <Form.Item
                      label="Hora"
                      name="tar_horavencimiento"
                      initialValue={moment(
                        task.tar_horavencimiento,
                        "HH:mm:ss"
                      )}
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                    >
                      <TimePicker
                        style={{ width: 150 }}
                        format="HH:mm"
                        use12Hours={false}
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={11} />
              </div>
            </Col>
          </Row>

          {task.not_desc && (
            <Row gutter={[8, 8]}>
              <Col xs={24}>
                <Form.Item required name="asignado" label="Nota">
                  <div
                    className="note-wrapper"
                    dangerouslySetInnerHTML={{
                      __html: task.not_desc,
                    }}
                  ></div>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <Form.Item required label="Prioridad" name="asignado">
                <span>
                  <Tag color={tagColor}>{task.pri_desc}</Tag>
                </span>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <Form.Item
                required
                label="Iniciado"
                name="iniciado"
                initialValue={task.iniciado}
              >
                <Input value={task.iniciado} />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{marginBottom: "16px"}} gutter={[8, 8]}>
            <Col xs={24}>
              <Form.Item
                required
                label="Asignado"
                name="asignado"
                initialValue={task.asignado}
              >
                <Input value={task.asignado} />
              </Form.Item>
            </Col>
          </Row>

          {task.up_filename && deleteArchivo === false && (
            <>
              {/* <Form.Item
                label="Detalle del archivo"
                name="nombreUpload"
                required
                initialValue={task.up_detalle}
              >
                <Input value={task.up_detalle} />
              </Form.Item>

              <Card>
                <div className="upload-wrapper">
                  <div className="upload-header">
                    {returnExtIcon(task.up_mimetype)}
                    <span style={{ marginLeft: "10px" }}>
                      {task.up_filename}
                    </span>
                  </div>
                </div>
              </Card> */}
              <List
                key="list"
                loading={loadingFile}
                itemLayout="horizontal"
                dataSource={[task]}
                renderItem={(item, idx) => {
                  return (
                    <div>
                      <List.Item key={idx}
                        actions={[
                          <DownloadOutlined onClick={() => handleClick(item)} style={{ color: "#56b43c" }} />, <Popconfirm
                            title={
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: 250,
                                  gap: 4,
                                }}
                              >
                                <label>¿Deseas eliminar el archivo <b>{item?.up_filename}</b>?</label>
                              </div>
                            }
                            okText="Borrar"
                            cancelText="Cerrar"
                            onConfirm={() => eliminarArchivo(item)}
                            placement="left"
                          >
                            <Button type="link" style={{ padding: "0px", margin: "0px" }}>
                              <DeleteOutlined style={{ color: "red" }} />
                            </Button>
                          </Popconfirm>
                        ]}
                      >
                          <List.Item.Meta
                            className="item_meta"
                            avatar={returnExtIcon(item.up_mimetype)}
                            description={<Metadata metadata={item} />}
                          />
                      </List.Item>
                    </div>
                  );
                }}
              />
            </>
          )}
        </Form>
      </Col>
    </Row>
  );
};

export default SeeTaskForm;
