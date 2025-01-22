import './index.css'
import routes from './routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AuthLayout from './containers/AuthLayout';

function App() {
    return (
        <Router>
            <Routes>
                {routes.map((route) => (
                    <Route
                        key={route.name}
                        path={route.path}
                        element={<route.component />}
                    />
                ))}
            </Routes>
        </Router>
    )
}

export default App;
