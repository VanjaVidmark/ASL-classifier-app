import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Classifier from './ClassifierPresenter';


function App() {

  return (
    <Router>
      <div className="App">
        <div className="Content">
          <Routes>
            <Route path="/" element={<Classifier />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
