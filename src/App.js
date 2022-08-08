import React from 'react';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';



function App() {
  console.log(process.env)
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;
