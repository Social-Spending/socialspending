import { Outlet } from 'react-router-dom';
import { GlobalContextProvider } from '../components/GlobalContext.js';

export default function Root() {
  // Set up the global context and render any other app page layout inside of it
  return (
    <GlobalContextProvider>
      <Outlet />
    </GlobalContextProvider>
  );
}
