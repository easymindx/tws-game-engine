import React from 'react';
import { World } from '@/webgl/world/World';
import Login from '@/pages/login';

import '@/assets/css/main.css';

declare global {
  interface Window {
    world: World;
  }
}

const App = () => {
  return <Login />;
};
export default App;
