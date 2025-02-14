import * as React from "react";

const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={`bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
