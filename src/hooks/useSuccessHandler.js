import { toast } from 'react-toastify';

export const useSuccessHandler = () => {
    const handleSuccess = (message) => {
        let successMessage = "Operation successful.";
    
        if (typeof message === "string") {
            successMessage = message;
        } else if (message && typeof message === "object" && message.message) {
            successMessage = message.message;
        }
    
        toast.success(successMessage);
    };
    

    return handleSuccess;
}
