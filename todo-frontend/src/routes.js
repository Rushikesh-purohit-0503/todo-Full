import AdminPanel from "./containers/AdminPanel";
import HomePage from "./containers/HomePage";
import MainPage from "./containers/mainPage";
import SignIn from "./containers/SignIn";
import SignUp from "./containers/SignUp";

const routes = [
    {
        path: '/signup',
        component: SignUp,
        name: 'signup',
    },
    {
        path: '/login',
        component: SignIn,
        name: 'login'
    },{
        path: '/',
        component: HomePage,
        name: 'home',
    },
    {
        path: '/main',
        component: MainPage,
        name: 'main',
    },
    {
        path: '/admin',
        component: AdminPanel,
        name: 'admin',
        allowedRoles: 1,
    }
]

export default routes;