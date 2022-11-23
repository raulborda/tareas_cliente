/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@apollo/client";
import BodyLayout from "../layout/body/BodyLayout";
import HeaderLayout from "../layout/header/HeaderLayout";
import QueryResult from "../queryResult/QueryResult";
import TaskTable from "../table/TaskTable";
import { TaskContext } from "../../context/TaskContext";
import { useContext, useEffect, useState } from "react";
import { GET_CLIENTE_FILTRO } from "../../graphql/query/tareas";

const TableView = () => {
  const {
    idUser,
    idCli,
    filterDate,
    filterState,
    filterEnable,
    idUsuarioFiltro,
    filterIniciadas,
    setQueryPollTareas
  } = useContext(TaskContext);
  const [tareas, setTareas] = useState([]);

  //! Para gestionar el switch del filtro, opto por enviar string vacio y 0 en las vars de la query
  //! de esta manera evito tener que estar seteando states y perdiendo el valor anterior

  const {
    error,
    loading,
    data: dataCliente,
    startPolling,
    stopPolling,
  } = useQuery(GET_CLIENTE_FILTRO, {
    variables: {
      idCliente: idCli,
      filtroFecha: filterEnable ? "" : filterDate.mode,
      fecha: filterEnable ? "" : filterDate.date,
      idEstado: filterEnable ? 0 : filterState,
      idUsuario: idUser
    },
  });



  useEffect(() => {
    setQueryPollTareas({ initial: startPolling, close: stopPolling });
    if (dataCliente) {
      const data = JSON.parse(dataCliente.getTareasPorClienteResolver);
      console.log(data)
      if (!filterIniciadas) {
        setTareas(data.tareas);
        console.log(data.tareas);
      } else {
        console.log(data.tareasIniciadas)
        setTareas(data.tareasIniciadas);
      }
    }

    // if (dataCliente) {
    //   const data = JSON.parse(dataCliente.getTareasPorClienteResolver);
    //   console.log(data);
    //   setTareas([]);
    // }
  }, [
    idUser,
    idCli,
    dataCliente,
    filterEnable,
    idUsuarioFiltro,
    filterIniciadas,
  ]);

  return (
    <>
      <HeaderLayout />
      <QueryResult error={error} loading={loading} data={dataCliente}>
        <BodyLayout
          queryPoll={{ startPolling, stopPolling }}
          children={
            <TaskTable
              tareas={tareas}
              queryPoll={{ startPolling, stopPolling }}
            />
          }
        />
      </QueryResult>
    </>
  );
};

export default TableView;
