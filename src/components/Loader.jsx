import img from "/logo.png";
const Loader = () => {
  // return <div className="flex justify-center items-center h-full"><span className="loader"></span></div>;
  return (
    <div className="flex justify-center items-center h-full">
      <div className="loader">
        <img src={img} />
      </div>
    </div>
  );
};

export default Loader;
