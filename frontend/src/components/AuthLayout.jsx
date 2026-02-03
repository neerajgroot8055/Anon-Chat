import Logo from "./Logo";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen px-6 py-10
      bg-gradient-to-br from-indigo-100 via-indigo-50 to-blue-100
      flex items-center justify-center">

      <div
        className="
          w-full
          max-w-2xl
          bg-white
          rounded-2xl
          shadow-2xl
          p-10
        "
      >
        <Logo large />
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
