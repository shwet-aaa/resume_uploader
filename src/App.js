// import logo from './logo.svg';

import Signup from "./SignUp";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Resume from "./Resume";

// import './App.css';
// from Signup

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Signup />} />   {/* Existing page */}
          <Route path="/Resume" element={<Resume />} /> {/* New page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
