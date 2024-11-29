import React from 'react';
import EditSubTipoIncidencia from '../../components/incidencias/Edit-SubTipoIncidencia';

const EditSubTipoIncidenciaPage = ({ query }) => {
    const { idSubTipo, idTipo } = query;
    return <EditSubTipoIncidencia idSubTipo={idSubTipo} idTipo={idTipo} />;
};

export const getServerSideProps = async (context) => {
    const { query } = context;
    return {
        props: { query },
    };
};

export default EditSubTipoIncidenciaPage;