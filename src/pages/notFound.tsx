import { Link } from "react-router-dom";

export function NotFound() {
    return (
        <div className="fex h-screen flex-col items-center gap-2">
            <h1 className="text-4xl font-bold">Pagina não encontrada</h1>
            <p>
                Voltar para
                <Link to="/">HomePage </Link>
            </p>
        </div>
    );
}
