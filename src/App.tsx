import { World } from "./webgl/world/World";
import { useEffect, useRef } from "react";

import "@/assets/scss/main.scss";

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

  return null;
};
export default App;
