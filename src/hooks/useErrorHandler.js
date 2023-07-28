import { toast } from 'react-toastify';

export const useErrorHandler = () => {
    const handleError = (error) => {
        let errorMessage = "An error occurred.";
    
        if (typeof error === "string") {
            errorMessage = error;
        } else if (error && typeof error === "object" && error.message) {
            errorMessage = error.message;
        }
    
        toast.error(errorMessage);
    };
    

    return handleError;
}

