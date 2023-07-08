import { Route, Navigate } from 'react-router-dom';


const checkAuth = () => {
    // Checks if there's a token in localStorage
    return !!localStorage.getItem('token');
  };



const PrivateRoute = ({ children, ...props }) => {
    const isAuthenticated = checkAuth(); // your authentication check function
    return (
        <Route {...props} render={() => {
            return isAuthenticated
                ? children
                : <Navigate to="/login" /> // redirects to login if not authenticated
        }} />
    );
}

export default PrivateRoute;