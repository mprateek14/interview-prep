import React, { useState, useContext, useCallback } from "react";
const MAX_STACK = 3;

const ToastContext = React.createContext(null);

export const ToastStackProvider = ({ children, maxStack = MAX_STACK }) => {
  const [toastList, setToastList] = useState([]);

  const addToast = useCallback(
    (message, duration = 3000) => {
      const newToast = {
        id: Date.now().toString() + Math.random().toString(),
        message: message,
        duration: duration,
      };

      setToastList((prevList) => {
        const listToUpdate =
          prevList.length === maxStack ? prevList.slice(1) : prevList;
        return [...listToUpdate, newToast];
      });
    },
    [maxStack],
  );

  const removeToast = useCallback(
    (id) => {
      setToastList((prevList) => prevList.filter((item) => item.id !== id));
    },
    [maxStack],
  );

  return (
    <>
      <ToastContext.Provider value={{ toastList, addToast, removeToast }}>
        {children}
      </ToastContext.Provider>
    </>
  );
};

export const useToastContext = () => useContext(ToastContext);
