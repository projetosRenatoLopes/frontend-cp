import React from 'react';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import '../src/components/CardCss/index.css'


function App() {  
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;
