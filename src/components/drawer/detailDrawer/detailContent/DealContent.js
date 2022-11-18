import {
  FilterOutlined,
  PlusOutlined,
  ShopOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Drawer,
  Progress,
  Row,
  Tabs,
  Timeline,
  Tooltip,
} from "antd";
import QueryResult from "../../../queryResult/QueryResult";
import { GET_NEGOCIO_CONTENT } from "../../../../graphql/query/negocios";
import moment from "moment";
import { useEffect, useState } from "react";
import { toCapitalize } from "../../../../utils/toCapitalize";
import NewNotaForm from "../newNotaForm/NewNotaForm";
import CompetidoresItem from "./CompetidoresItem";
import NoteItem from "./NoteItem";
import ProductosItem from "./ProductosItem";
import TaskItem from "./TaskItem";
import UploadItem from "./UploadItem";
import "./index.css";
import { useContext } from "react";
import { TaskContext } from "../../../../context/TaskContext";
import NewDealTaskForm from "../newDealTaskForm/NewDealTaskForm";


const DealContent = ({ idNegocio }) => {
  const [dataNegocio, setDataNegocio] = useState();
  const [dataHistorialNeg, setDataHistorialNeg] = useState([]);
  const [dataPorcentajeTareas, setDataPorcentajeTareas] = useState();
  const [tareasDeNegocio, setTareasDeNegocio] = useState([]);
  const [notasDeNegocio, setNotasDeNegocio] = useState([]);
  const [adjuntosDeNegocio, setAdjuntosDeNegocio] = useState([]);
  const [productosDeNegocio, setProductosDeNegocio] = useState([]);
  const [competidoresDeNegocio, setCompetidoresDeNegocio] = useState([]);

  const [showDrawerNewNota, setShowDrawerNewNota] = useState(false);
  const [showDrawerTarea, setShowDrawerTarea] = useState(false);
  const { setQueryPollDealContent } = useContext(TaskContext);

  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_NEGOCIO_CONTENT,
    {
      variables: {
        idNegocio: idNegocio,
        idHistorialNegocio: idNegocio,
        idNegocioPorcentaje: idNegocio,
        idNegocioTimeline: idNegocio,
        estadoTarea: 1,
      },
    }
  );

  const { TabPane } = Tabs;

  const returnTimelineItem = (item, idx) => {
    switch (true) {
      case item.his_detalle.includes("####T_"):
        return <TaskItem taskData={tareasDeNegocio} item={item} key={idx} />;
      case item.his_detalle.includes("####N_"):
        return <NoteItem noteData={notasDeNegocio} item={item} key={idx} />;
      case item.his_detalle.includes("####A_"):
        return (
          <UploadItem uploadData={adjuntosDeNegocio} item={item} key={idx} />
        );

      default:
        return (
          <Timeline.Item color="green" key={item.his_detalle}>
            <div
              key={idx}
              dangerouslySetInnerHTML={{
                __html: item.his_detalle,
              }}
            ></div>
          </Timeline.Item>
        );
    }
  };

  const colors = [
    "#d06868",
    "#e6a85f",
    "#f1e04c",
    "#bbd068",
    "#32e44f",
    "#49dcd3",
    "#4698e4",
    "#9c68d0",
    "#d0689a",
    "#FA2D5E",
  ];

  useEffect(() => {
    setQueryPollDealContent({ initial: startPolling, close: stopPolling });

    if (data) {
      setDataNegocio(JSON.parse(data.getDealContentIframeResolver));
      setCompetidoresDeNegocio(
        JSON.parse(data.getDealContentIframeResolver).dataComp
      );
      setProductosDeNegocio(
        JSON.parse(data.getDealContentIframeResolver).dataProd
      );

      setDataHistorialNeg(data.getHistorialByNegocioResolver);

      setTareasDeNegocio(JSON.parse(data.getTimeLineByNegocioResolver).dataTar);
      setAdjuntosDeNegocio(
        JSON.parse(data.getTimeLineByNegocioResolver).dataUp
      );
      setNotasDeNegocio(JSON.parse(data.getTimeLineByNegocioResolver).dataNot);
      setDataPorcentajeTareas(data.tiposTareasCantidadResolver);
    }
  }, [data]);

  return (
    <QueryResult loading={loading} error={error} data={data}>
      <Tabs tabBarStyle={{ color: "#00B33C" }}>
        <TabPane tab="Info" key="1">
          <Row>
            <Col span={14}>
              {dataNegocio && (
                <div className="dealInfo-wrapper">
                  <h2 style={{ color: "#00b33c", fontWeight: "bold" }}>
                    {dataNegocio.dataNeg.neg_asunto}
                  </h2>
                  <span className="dealInfo-importe">
                    {dataNegocio.dataNeg.mon_iso +
                      " " +
                      dataNegocio.dataNeg.neg_valor.toLocaleString("de-DE", {
                        minimumFractionDigits: 0,
                      })}
                  </span>
                  <span>
                    <ShopOutlined /> {dataNegocio.dataNeg.cli_nombre}
                  </span>
                  {dataNegocio.dataNeg.con_nombre && (
                    <span>
                      <UserOutlined /> {dataNegocio.dataNeg.con_nombre}
                    </span>
                  )}
                  <span>
                    <FilterOutlined />{" "}
                    <strong>{dataNegocio.dataNeg.pip_nombre}</strong> -{" "}
                    {dataNegocio.dataNeg.eta_nombre}
                  </span>
                  <span>
                    <TrophyOutlined />{" "}
                    {moment(dataNegocio.dataNeg.neg_fechacierre).format(
                      "DD/MM/YYYY"
                    )}
                  </span>
                </div>
              )}
            </Col>
            <Col
              span={10}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {dataNegocio && (
                <>
                  <div className="progress_wrapper">
                    <span>Antigüedad del negocio</span>
                    <span>
                      {dataNegocio.dataNeg.antiguedadTrato}{" "}
                      {dataNegocio.dataNeg.antiguedadTrato > 1 ? `días` : `día`}
                    </span>{" "}
                  </div>
                  <Progress
                    strokeColor={{
                      "0%": "#87d068",
                      "85%": "#f0db24",
                      "100%": "#f11515",
                    }}
                    percent={100}
                    showInfo={false}
                  />
                </>
              )}

              <div className="task_bar_container">
                Tareas
                <div className="task_bar_wrapper">
                  {dataPorcentajeTareas &&
                    dataPorcentajeTareas.map((tipoTarea, i) => (
                      <Tooltip
                        key={i}
                        placement="top"
                        title={`${tipoTarea.cantidadTipoTarea}  ${toCapitalize(
                          tipoTarea.tip_desc.toLowerCase()
                        )}  ( ${tipoTarea.porcentajeTipoTarea}% )`}
                      >
                        <span
                          className="bar"
                          style={{
                            width: `${tipoTarea.porcentajeTipoTarea}%`,
                            background: colors[i],
                          }}
                        ></span>
                      </Tooltip>
                    ))}
                </div>
                <div className="task_bar_reference_wrapper" key={"task_bar"}>
                  {dataPorcentajeTareas &&
                    dataPorcentajeTareas.map((tipoTarea, i) => {
                      return (
                        <div className="task_bar_reference_item" key={i}>
                          <span
                            className="reference"
                            style={{ background: `${colors[i]}` }}
                          ></span>
                          <span className="item">
                            {toCapitalize(tipoTarea.tip_desc)} (
                            {tipoTarea.cantidadTipoTarea})
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Productos" key="2">
          <ProductosItem data={productosDeNegocio} />
        </TabPane>
        <TabPane tab="Competidores" key="3">
          <CompetidoresItem data={competidoresDeNegocio} />
        </TabPane>
      </Tabs>
      <Row>
        <Col
          span={24}
          style={{
            justifyContent: "end",
            display: "flex",
            marginTop: "25px",
          }}
        >
          <Button
            type="primary"
            style={{ backgroundColor: "#00B33C", border: "1px solid #00B33C" }}
            onClick={() => setShowDrawerNewNota(!showDrawerNewNota)}
          >
            <PlusOutlined /> Nota
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: "#00B33C", border: "1px solid #00B33C" }}
            onClick={() => setShowDrawerTarea(!showDrawerTarea)}
          >
            <PlusOutlined /> Tarea
          </Button>
        </Col>
      </Row>
      <Row>
        <Col
          span={24}
          style={{
            justifyContent: "center",
            display: "flex",
            marginTop: "25px",
          }}
        >
          <Timeline key={"timeline"}>
            {dataHistorialNeg &&
              dataHistorialNeg.map((historial) =>
                returnTimelineItem(historial)
              )}
          </Timeline>
        </Col>

        <Drawer
          title="Nueva Nota"
          visible={showDrawerNewNota}
          destroyOnClose={true}
          onClose={() => setShowDrawerNewNota(false)}
        >
          <NewNotaForm
            idNegocio={idNegocio}
            closeDrawer={setShowDrawerNewNota}
          />
        </Drawer>
        <Drawer
          width={600}
          title="Nueva tarea de negocio"
          visible={showDrawerTarea}
          destroyOnClose={true}
          onClose={() => setShowDrawerTarea(false)}
        >
          <NewDealTaskForm
            idNegocio={idNegocio}
            dataNegocio={dataNegocio}
            closeDrawer={setShowDrawerTarea}
          />
        </Drawer>
      </Row>
    </QueryResult>
  );
};

export default DealContent;
