import toast from "react-hot-toast";

export const successToast = (message: string) => toast.success(message, {
  duration: 4000,
  position: 'top-center',
  style: {
    border: '1px solid #713200',
    padding: '16px',
    color: '#713200',
  },
  className: '',
  icon: '👏',
  iconTheme: {
    primary: '#000',
    secondary: '#fff',
  },
  ariaProps: {
    role: 'status',
    'aria-live': 'polite',
  },
});

export const errorToast = (message: string) => toast.error(message, {
  duration: 4000,
  position: 'top-center',
  style: {
    border: '1px solid #713200',
    padding: '16px',
    color: '#713200',
  },
  className: '',
  icon: '👏',
  iconTheme: {
    primary: '#000',
    secondary: '#fff',
  },
  ariaProps: {
    role: 'status',
    'aria-live': 'polite',
  },
});

export const loadingToast = (message: string) => toast.loading(message, {
  duration: 4000,
  position: 'top-center',
  style: {
    border: '1px solid #713200',
    padding: '16px',
    color: '#713200',
  },
  className: '',
  icon: '👏',
  iconTheme: {
    primary: '#000',
    secondary: '#fff',
  },
  ariaProps: {
    role: 'status',
    'aria-live': 'polite',
  },
});
