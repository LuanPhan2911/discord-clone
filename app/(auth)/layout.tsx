import { FunctionComponent } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FunctionComponent<AuthLayoutProps> = ({ children }) => {
  return <div className="bg-red-100 h-full">{children}</div>;
};

export default AuthLayout;
