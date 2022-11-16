import { ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import "moment/locale/es";
import apolloClient from "./apollo/apolloClient";
import MainLayout from "./components/layout/MainLayout";
import { TaskContext } from "./context/TaskContext";
import { useEffect, useState } from "react";
import "./App.css";
import moment from "moment";

const App = () => {
  //* Para inicializar el state calculo la semana actual
  const weeknumber = moment().week();
  const yearnumber = moment().year();
  const currentWeek = `${yearnumber}${weeknumber}`;

  const [idUser, setIdUser] = useState();
  const [idCli, setIdCli] = useState();
  const [taskDrawerVisible, setTaskDrawerVisible] = useState({
    visible: false,
    content: null,
  });
  //* handle del contenido del componente nota para utilizar en formulario
  const [noteContent, setNoteContent] = useState("");
  //* handle de filtros por fecha con el modo
  const [filterDate, setFilterDate] = useState({
    mode: "week",
    date: currentWeek,
  });

  const [filterState, setFilterState] = useState(1);

  const [viewMode, setViewMode] = useState("tableView");

  const [filterEnable, setFilterEnable] = useState(false);
  //* handle id grupo o id del usuario
  const [idUsuarioFiltro, setIdUsuarioFiltro] = useState("");
  const [queryPollDealContent, setQueryPollDealContent] = useState();
  const [filterIniciadas, setFilterIniciadas] = useState(false);


  useEffect(() => {
    const url = window.location;
    const urlSearch = url.search;
    const localStorage = window.localStorage;

    if (urlSearch) {
      console.log(url);
      const params = urlSearch.split("=");
      const idUserFromParams = params[1];
      setIdUser(Number(idUserFromParams));
      // console.log("Usuario ->", idUserFromParams);

       //idCliente por URL
       const idClient = localStorage.cliente;
       setIdCli(6510)
       //setIdCli(Number(idClient));
       console.log("Cliente ->", idCli);
    }
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <ConfigProvider locale={esES}>
        <TaskContext.Provider
          value={{
            idUser,
            idCli,
            taskDrawerVisible,
            setTaskDrawerVisible,
            noteContent,
            setNoteContent,
            filterDate,
            setFilterDate,
            filterState,
            setFilterState,
            viewMode,
            setViewMode,
            filterEnable,
            setFilterEnable,
            idUsuarioFiltro,
            setIdUsuarioFiltro,
            queryPollDealContent,
            setQueryPollDealContent,
            filterIniciadas,
            setFilterIniciadas,
          }}
        >
          <MainLayout />
        </TaskContext.Provider>
      </ConfigProvider>
    </ApolloProvider>
  );
};

export default App;
