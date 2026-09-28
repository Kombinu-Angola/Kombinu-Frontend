import { Outlet } from 'react-router-dom';
import { Header } from './PublicHeader';



export default function BaseLayout() {
  return (
    <>
      <Header />

      <main >
        <Outlet />
      </main>

    </>
  );
}
