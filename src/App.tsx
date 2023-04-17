import React from 'react';
import './App.css';
import Config from "./components/Config";
import {ConfigType} from "./helpers/types";
import Board from "./components/Board";

function App() {
  const [config, setConfig] = React.useState<ConfigType | null>(null)
  const setupConfig = (width: number, height: number, mines: number) => {
    setConfig({width, height, mines})
  }
  return (
    <div className="App">
      <Config setupConfig={setupConfig} />
      { config && <Board config={config} /> }
    </div>
  );
}

export default App;
