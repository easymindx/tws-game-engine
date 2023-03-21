import { useEffect, useRef } from 'react';
import { World } from '@/webgl/world/World';

export default function Game() {
  const initialized = useRef(false);
  const canvas = useRef();

  useEffect(() => {
    if (!initialized.current) {
      window.world = new World(canvas.current, '/assets/models/world.glb');
      initialized.current = true;
    }
  }, []);

  return (
    <>
      <div
        id="loading-screen"
        className="w-[80%]"
        style={{ display: 'hidden' }}
      >
        <div id="loading-screen-background"></div>
        <h1 id="main-title" className="sb-font">
          Web Social Media Game
        </h1>
      </div>
      <canvas ref={canvas} />
    </>
  );
}
