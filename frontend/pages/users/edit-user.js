import EditUser from '../../components/users/Edit-User';

const EditUserPage = ({ query }) => {
    const { id } = query;
    return <EditUser userId={id} />;
};

export const getServerSideProps = async (context) => {
    const { query } = context;
    return {
        props: { query },
    };
};

export default EditUserPage;