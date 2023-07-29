import { toast } from 'react-toastify';

export const useErrorHandler = () => {
    const handleError = (error) => {
        let errorMessage = "An error occurred.";
    
        if (typeof error === "string") {
            errorMessage = error;
        } else if (error && typeof error === "object" && error.message) {
            errorMessage = error.message;
        }
        if (errorMessage !== "Topic not found") {
            toast.error(errorMessage);
        }

        if(errorMessage == "Failed to fetch") {
            toast.error("An error occured while communication with the server");
        }
    };
    

    return handleError;
}

