import React, { useEffect } from "react";
import { useToastContext } from "../../contexts/ToastStack";
import { createPortal } from "react-dom";

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    let timer = setTimeout(() => {
      onClose();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className="toast-wrapper"
      style={{
        width: "150px",
        height: "100%",
        padding: "5px",
        backgroundColor: "steelblue",
        color: "white",
      }}
    >
      {toast.message}
    </div>
  );
};

function ToastList() {
  const { toastList, addToast, removeToast } = useToastContext();

  if (!document) return;

  return (
    <>
      <button onClick={() => addToast(crypto.randomUUID().slice(15))}>Click for toast</button>

      {createPortal(
        <div
          className="toast-list"
          style={{ position: "absolute", right: "50px", bottom: "50px", display:"flex", flexDirection:"column", gap:"5px" }}
        >
          {toastList.map((item) => {
            return (
              <Toast
                key={item.id}
                toast={item}
                onClose={() => removeToast(item.id)}
              />
            );
          })}
        </div>,
        document.body,
      )}
    </>
  );
}

export default ToastList;
