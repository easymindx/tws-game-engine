import { PacmanLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-green-200 to-green-600">
      <PacmanLoader color="#800000" />
    </div>
  );
}
