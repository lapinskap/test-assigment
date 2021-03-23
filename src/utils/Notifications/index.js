import { Bounce, toast } from 'react-toastify';

// eslint-disable-next-line import/prefer-default-export
export const dynamicNotification = (message, type = 'success', position = 'top-right', time = 3000) => {
  toast(
    message,
    {
      transition: Bounce,
      closeButton: true,
      autoClose: time,
      position,
      type,
      hideProgressBar: true,
    },
  );
};
