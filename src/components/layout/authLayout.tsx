import { Outlet } from 'react-router-dom';




export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">


            <main className="flex-grow">
                <Outlet />
            </main>

        </div>
    );
}
