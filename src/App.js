import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="App">
      <h1 style={{padding:"10px", margin:"0",width: "auto"}}>The Shoppies</h1>
      <SearchBar/>
    </div>
  );
}

export default App;
