import { Outlet } from "react-router-dom";

export function DashboardLayout() {
    return (
        <>
            <main>
                <Outlet />
            </main>
        </>
    );
}
