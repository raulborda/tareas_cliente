/* eslint-disable no-unused-vars */
import {
  AreaChartOutlined,
  CalendarOutlined,
  FunnelPlotOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Switch } from "antd";
import { TaskContext } from "../../../context/TaskContext";
import { GET_USUARIOS_Y_GRUPOS } from "../../../graphql/query/usuarios";
import { useContext, useEffect, useState } from "react";
import DateFilter from "./DateFilter";
import "./index.css";
import StateFilter from "./StateFilter";
import UserGroupFilter from "./UserGroupFilter";

const HeaderLayout = () => {
  const {
    setTaskDrawerVisible,
    idUser,
    idCli,
    setViewMode,
    filterEnable,
    setFilterEnable,
    setFilterIniciadas,
    filterIniciadas,
  } = useContext(TaskContext);

  const [listadoUsuarios, setListadoUsuarios] = useState([]);
  const [listadoGrupos, setListadoGrupos] = useState([]);
  const [usuarioNormal, setUsuarioNormal] = useState(false);

  const { data } = useQuery(GET_USUARIOS_Y_GRUPOS, {
    variables: { idUsuario: idUser },
  });

  useEffect(() => {
    if (data) {
      const dataUsuariosYGrupos = JSON.parse(
        data.getUsuariosGruposIframeResolver
      );

      if (dataUsuariosYGrupos) {
        setListadoGrupos(dataUsuariosYGrupos.listadoGrupos);
        setListadoUsuarios(dataUsuariosYGrupos.listadoUsuarios);
        //console.log(dataUsuariosYGrupos.listadoUsuarios)
      } else {
        setUsuarioNormal(true);
      }
    }
  }, [data]);

  return (
    <div className="top-panel-wrapper">
      <span></span>
      <div className="top-panel-buttons">
        {/* <Switch
          onChange={(v) => {
            setFilterIniciadas(!v);
          }}
          checkedChildren={<UserAddOutlined />}
          unCheckedChildren={<UsergroupAddOutlined />}
          defaultChecked
        /> */}
        <Switch
          onChange={() => setFilterIniciadas(!filterIniciadas)}
          checkedChildren={<UserAddOutlined />}
          unCheckedChildren={<UsergroupAddOutlined />}
          checked={filterIniciadas}
        />

        <DateFilter filterEnable={filterEnable} />
        <StateFilter filterEnable={filterEnable} />
        <Button
          type="primary"
          style={{ marginLeft: 5 }}
          onClick={() =>
            setTaskDrawerVisible({ visible: true, content: "Nueva Tarea" })
          }
        >
          <PlusOutlined style={{ color: "white" }} /> Tarea
        </Button>
      </div>
    </div>
  );
};

export default HeaderLayout;
