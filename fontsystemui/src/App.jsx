import "./App.css";
import Loader from "./components/loader";
import FontData from "./font/fontdata";
import Creategroupform from "./fontgroup/creategroupform";
import Fontgroup from "./fontgroup/fontgroup";

function App() {
  return (
    <><div className="min-h-screen">

    
      <div className="h-1/4">
        <Loader />
      </div>
      <div className="h-1/4">
        <FontData />
      </div>
      <div className="h-1/4">
        <Creategroupform />
      </div><div className="h-1/4">
        <Fontgroup />
      </div></div>
    </>
  );
}

export default App;
