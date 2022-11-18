const { gql } = require("@apollo/client");

export const NEW_TAREA = gql`
  mutation newTareaIframe(
    $inputTarea: tareaInput
    $inputNota: notaInput
    $inputAdjunto: uploadInput
    $usuAsig: Int
  ) {
    newTareaIframeResolver(
      inputTarea: $inputTarea
      inputNota: $inputNota
      inputAdjunto: $inputAdjunto
      usuAsig: $usuAsig
    )
  }
`;

export const UPDATE_ESTADO_TAREA = gql`
  mutation updateEstadoTareaIframeResolver($idTarea: Int) {
    updateEstadoTareaIframeResolver(idTarea: $idTarea)
  }
`;

export const UPDATE_TAREA = gql`
  mutation updateTarea(
    $idTarea: Int
    $inputTarea: tareaInput
    $inputAdjunto: uploadInput
    $inputNota: notaInput
    $idUsuario: Int
  ) {
    updateTareaResolver(
      idTarea: $idTarea
      inputTarea: $inputTarea
      inputAdjunto: $inputAdjunto
      inputNota: $inputNota
      idUsuario: $idUsuario
    )
  }
`;

export const NEW_TAREA_DE_NEGOCIO = gql`
  mutation newTareaResolver(
    $inputTarea: tareaInput
    $idNegocio: Int
    $idUsuario: Int
    $idCliente: Int
    $inputNota: notaInput
    $inputAdjunto: uploadInput
    $idContacto: Int
    $idUsuarioAsignado: Int
  ) {
    newTareaResolver(
      inputTarea: $inputTarea
      idNegocio: $idNegocio
      inputNota: $inputNota
      idUsuario: $idUsuario
      idCliente: $idCliente
      inputAdjunto: $inputAdjunto
      idContacto: $idContacto
      idUsuarioAsignado: $idUsuarioAsignado
    )
  }
`;

export const TAREA_ANCLADA = gql`
  mutation tareaAnclado($idTarea: Int, $anclado: Int) {
    tareaAncladaResolver(idTarea: $idTarea, anclado: $anclado)
  }
`;
