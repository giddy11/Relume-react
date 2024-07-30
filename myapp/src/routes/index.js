import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import SignUp from '../pages/Signup'
// import Login from '../pages/Login'
// import ForgotPassowrd from '../pages/ForgotPassowrd'
// import SignUp from '../pages/SignUp'
// import AdminPanel from '../pages/AdminPanel'
// import AllUsers from '../pages/AllUsers'
// import AllProducts from '../pages/AllProducts'
// import CategoryProduct from '../pages/CategoryProduct'
// import ProductDetails from '../pages/ProductDetails'
// import Cart from '../pages/Cart'
// import SearchProduct from '../pages/SearchProduct'

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "/s",
                element : <SignUp/>
            }
        ]
    }
])


export default router