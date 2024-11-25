import { AuthProvider } from '../services/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;