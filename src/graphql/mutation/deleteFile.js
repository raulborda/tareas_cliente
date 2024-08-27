import { gql } from '@apollo/client';

export const ELIMINAR_ARCHIVO = gql`
	mutation deleteUploadFile($idFile: Int) {
		deleteUploadFileResolver(idFile: $idFile)
	}
`;
