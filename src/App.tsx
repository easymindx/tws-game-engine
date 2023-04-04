import { useEffect, useRef } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { WorldEvent } from '@/engine/enums/WorldEvent';
import { World } from '@/engine/world';
import Loading from './pages/loading';
import LINKS from './utils/constants/links';

export default function App() {
  const initialized = useRef(false);
  const canvas = useRef();
  const navigate = useNavigate();

  const handleWorldEvent = (code: WorldEvent) => {
    if (code === WorldEvent.JoinedRoom) {
      setTimeout(() => navigate(LINKS.game), 500);
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      const world = new World(canvas.current, '/assets/models/world.glb');
      world.onEvent = handleWorldEvent;
      initialized.current = true;
    }
  }, []);

  return (
    <div className="w-100 h-100 relative">
      <div className="absolute top-0 left-0 z-10">
        <Routes>
          <Route path={LINKS.loading} Component={Loading} />
          <Route path={LINKS.game} element={null} />
        </Routes>
      </div>
      <canvas ref={canvas} className="absolute top-0 left-0 z-0" />
    </div>
  );
}
