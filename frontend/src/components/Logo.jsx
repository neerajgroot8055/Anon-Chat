const Logo = ({ large = false }) => {
  return (
    <div className="text-center mb-6">
      <h1
        className={`font-bold tracking-tight ${
          large ? "text-4xl" : "text-2xl"
        } text-indigo-600`}
      >
        AnonChat
      </h1>
      <p className="text-sm text-gray-500">
        Talk freely. Stay anonymous.
      </p>
    </div>
  );
};

export default Logo;
