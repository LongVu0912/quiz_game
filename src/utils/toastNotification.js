import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const toastNotification = (message, type, autoClose) => {
    toast(message, {
        autoClose: autoClose,
        dangerouslyHTMLString: true,
        type: type,
        transition: "slide",
        theme: "colored",
    });
};

export default toastNotification;
