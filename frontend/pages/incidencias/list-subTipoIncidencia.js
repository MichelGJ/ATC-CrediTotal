import React from 'react';
import ListSubTipoIncidencia from '../../components/incidencias/List-SubTipoIncidencia';

const ListSubTipoIncidenciaPage = ({ query }) => {
    const { idTipo } = query;
    return <ListSubTipoIncidencia idTipo={idTipo} />;
};

export const getServerSideProps = async (context) => {
    const { query } = context;
    return {
        props: { query },
    };
};


export default ListSubTipoIncidenciaPage;