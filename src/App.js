import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Scoreboard from "./Scoreboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/scoreboard" element={<Scoreboard />} />
      </Routes>
    </Router>
  );
} 
export default App;
