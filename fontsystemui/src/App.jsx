import "./App.css";
import Loader from "./components/loader";
import FontData from "./font/fontdata";

function App() {
  return (
    <>
      <div className="h-1/4">
        <Loader />
      </div>
      <div className="h-1/4">
        <FontData />
      </div>
    </>
  );
}

export default App;
