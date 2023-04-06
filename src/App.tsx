import { Route, Routes, useNavigate } from 'react-router-dom';
import { Unity, useUnityContext } from 'react-unity-webgl';
import Loading from './pages/loading';
import LINKS from './utils/constants/links';
import { useEffect } from 'react';

export default function App() {
  const navigate = useNavigate();
  const { unityProvider, isLoaded } = useUnityContext({
    loaderUrl: 'build/tws-unity.loader.js',
    dataUrl: 'build/tws-unity.data.unityweb',
    frameworkUrl: 'build/tws-unity.framework.js.unityweb',
    codeUrl: 'build/tws-unity.wasm.unityweb',
  });

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => navigate(LINKS.game), 3000);
    }
  }, [isLoaded]);

  return (
    <div className="w-100 h-100 relative">
      <div className="absolute top-0 left-0 z-10">
        <Routes>
          <Route path={LINKS.loading} Component={Loading} />
          <Route path={LINKS.game} element={null} />
        </Routes>
      </div>
      <Unity unityProvider={unityProvider} className="h-screen w-screen" />
    </div>
  );
}
