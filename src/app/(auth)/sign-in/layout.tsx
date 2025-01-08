import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="h-[100svh] flex items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
