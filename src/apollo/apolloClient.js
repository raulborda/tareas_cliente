/* eslint-disable no-unused-vars */
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const PORT = "4002";
const PROTOCOL = window.location.protocol;
const HOSTNAME = window.location.hostname;
const URL = `${PROTOCOL}//${HOSTNAME}:${PORT}`;

const apolloClient = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: new HttpLink({
    // uri: "http://beeapp.binamics.com.ar:4002",
    // uri: "http://localhost:4002/graphql",
    uri: URL,
    //uri:"http://172.16.150.38:4002", //ganadera
    //uri: "http://10.0.0.28:4002",
    //uri: "http://10.0.0.153:4002",
    //uri: "http://170.239.49.41:4002",

  }),
});

export default apolloClient;
