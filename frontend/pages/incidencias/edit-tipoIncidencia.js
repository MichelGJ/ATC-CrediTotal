import React from 'react';
import EditTipoIncidencia from '../../components/incidencias/Edit-TipoIncidencia';

const EditTipoIncidenciaPage = ({ query }) => {
    const { idTipo } = query;
    return <EditTipoIncidencia idTipo={idTipo} />;
};

export const getServerSideProps = async (context) => {
    const { query } = context;
    return {
        props: { query },
    };
};

export default EditTipoIncidenciaPage;