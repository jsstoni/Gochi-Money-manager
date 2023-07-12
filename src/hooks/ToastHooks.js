import { toast } from "vue3-toastify";

const options = {
  position: toast.POSITION.BOTTOM_RIGHT,
  multiple: false,
};

const success = (msg) => {
  toast.success(msg, options);
};

const info = (msg) => {
  toast.info(msg, options);
};

const warning = (msg) => {
  toast.warning(msg, options);
};

const error = (msg) => {
  toast.error(msg, options);
};

export { success, info, warning, error };
