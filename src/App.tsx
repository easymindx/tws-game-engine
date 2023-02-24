import React, { useEffect, useRef } from 'react';
import { World } from './webgl/world/World';

import '@/assets/scss/main.scss';

declare global {
  interface Window {
    world: World;
  }
}

const App = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      window.world = new World('/assets/models/world.glb');
      initialized.current = true;
    }
  }, []);

  return (
    <>
      <div id="loading-screen">
        <div id="loading-screen-background"></div>
        <h1 id="main-title" className="sb-font">
          Web Social Media Game
        </h1>
      </div>
      <div id="ui-container" style={{ display: 'none' }}>
        <div className="github-corner"></div>
        <div className="left-panel">
          <div id="controls" className="panel-segment flex-bottom"></div>
        </div>
      </div>
    </>
  );
};
export default App;
