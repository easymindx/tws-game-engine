import { Unity, useUnityContext } from 'react-unity-webgl';

export default function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: 'build/tws.loader.js',
    dataUrl: 'build/tws.data.unityweb',
    frameworkUrl: 'build/tws.framework.js.unityweb',
    codeUrl: 'build/tws.wasm.unityweb',
  });

  return <Unity unityProvider={unityProvider} className="h-screen w-screen" />;
}
