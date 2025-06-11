import { toast, Bounce, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "info" | "success" | "warning" | "error";

interface ShowToastOptions {
  message: string;
  type?: ToastType;
  position?: ToastOptions["position"];
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: ToastOptions["theme"];
}

const toastMap: Record<ToastType, typeof toast.info> = {
  info: toast.info,
  success: toast.success,
  warning: toast.warning,
  error: toast.error,
};

export const showToast = ({
  message,
  type = "info",
  position = "bottom-center",
  autoClose = 5000,
  hideProgressBar = false,
  closeOnClick = true,
  pauseOnHover = true,
  draggable = false,
  theme = "colored",
}: ShowToastOptions): void => {
  toastMap[type](message, {
    position,
    autoClose,
    hideProgressBar,
    closeOnClick,
    pauseOnHover,
    draggable,
    theme,
    transition: Bounce,
    style: {
      fontSize: "1.6rem",
    },
  });
};
