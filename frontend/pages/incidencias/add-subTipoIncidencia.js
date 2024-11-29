import React from 'react';
import AddSubTipoIncidencia from '../../components/incidencias/Add-SubTipoIncidencia';

const AddSubTipoIncidenciaPage = ({ query }) => {
    const { idTipo } = query;
    return <AddSubTipoIncidencia idTipo={idTipo} />;
};

export const getServerSideProps = async (context) => {
    const { query } = context;
    return {
        props: { query },
    };
};


export default AddSubTipoIncidenciaPage;