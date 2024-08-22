import { ApolloProvider } from "@apollo/client";
import { Button, ConfigProvider, Modal } from "antd";
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
  const formattedWeek = weeknumber.toString().padStart(2, "0"); // Agrega un 0 si el número es menor a 10
  const currentWeek = `${yearnumber}${formattedWeek}`;

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
  const [queryPollTareas, setQueryPollTareas] = useState();
  const [dropdownText, setDropdownText] = useState("Semana");

  useEffect(() => {
    const url = window.location;
    const urlSearch = url.search;
    const localStorage = window.localStorage;

    if (urlSearch) {
      // console.log(url);
      const params = urlSearch.split("=");
      const idUserFromParams = params[1];
      //setIdUser(Number(idUserFromParams));// para el viejo
      //console.log("Usuario ->", idUserFromParams);

      setIdUser(Number(localStorage.getItem("usuario"))); //para el nuevo

      //idCliente por URL
      //const idClient = localStorage.cliente; // para la version vieja de cliente es esta
      const idClient = localStorage.getItem("cliSelect"); // para la version nueva de cliente es esta

      //.28
      //setIdCli(6510) //A.P.I.N.T.A
      //setIdCli(2049); //ACONCAGUA
      //.153
      //setIdCli(2)
      //caverzasi
      //setIdCli(727);
      setIdCli(Number(idClient));
      //console.log("Cliente ->", idCli);
    }
  }, []);

  console.log('version modulo-tareas_cliente: 22.08.24');

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
            queryPollTareas,
            setQueryPollTareas,
            dropdownText,
            setDropdownText,
          }}
        >
          <MainLayout />
        </TaskContext.Provider>
      </ConfigProvider>
    </ApolloProvider>
  );
};

export default App;
