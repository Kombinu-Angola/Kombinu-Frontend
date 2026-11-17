import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Seccao = { titulo: string; texto: string };

function PaginaLegal({ titulo, seccoes, outras }: { titulo: string; seccoes: Seccao[]; outras: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link to="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          ← Voltar à Kombinu
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">{titulo}</h1>
        <p
          role="note"
          className="mt-4 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
        >
          Texto provisório. A versão final será publicada antes do lançamento comercial.
        </p>
        <div className="mt-8 space-y-6">
          {seccoes.map((s) => (
            <section key={s.titulo}>
              <h2 className="text-lg font-semibold">{s.titulo}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.texto}</p>
            </section>
          ))}
        </div>
        <nav aria-label="Outras páginas legais" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-sm">
          {outras}
        </nav>
      </div>
    </main>
  );
}

const ligacoes = (atual: 'termos' | 'privacidade' | 'direitos') => (
  <>
    {atual !== 'termos' && <Link className="text-primary underline-offset-4 hover:underline" to="/termos">Termos de utilização</Link>}
    {atual !== 'privacidade' && <Link className="text-primary underline-offset-4 hover:underline" to="/privacidade">Privacidade e dados</Link>}
    {atual !== 'direitos' && <Link className="text-primary underline-offset-4 hover:underline" to="/direitos">Direitos de autor e remoção</Link>}
  </>
);

export function Termos() {
  return (
    <PaginaLegal
      titulo="Termos de utilização"
      outras={ligacoes('termos')}
      seccoes={[
        { titulo: 'Quem somos', texto: 'A Kombinu é uma plataforma angolana de estudo com simulados e resumos escritos por estudantes e docentes.' },
        { titulo: 'A tua conta', texto: 'Para guardares o teu progresso crias uma conta. És responsável por manter os teus dados de acesso em segurança.' },
        { titulo: 'Conteúdo publicado', texto: 'Quem publica conteúdo declara que é o autor ou que tem autorização para o partilhar. Podemos retirar conteúdo que viole estes termos ou direitos de terceiros.' },
        { titulo: 'Alterações', texto: 'Estes termos podem mudar. Avisamos na plataforma quando houver alterações relevantes.' },
      ]}
    />
  );
}

export function Privacidade() {
  return (
    <PaginaLegal
      titulo="Privacidade e dados"
      outras={ligacoes('privacidade')}
      seccoes={[
        { titulo: 'Dados que recolhemos', texto: 'Nome, email, o teu desempenho nos simulados e a escola a que pertences, quando houver.' },
        { titulo: 'Para que os usamos', texto: 'Para te dar acesso à plataforma, guardar o teu progresso e melhorar o serviço. Não vendemos os teus dados.' },
        { titulo: 'Os teus direitos', texto: 'Podes pedir acesso, correção ou eliminação dos teus dados, nos termos da Lei n.º 22/11 (Protecção de Dados Pessoais).' },
        { titulo: 'Menores de 18 anos', texto: 'O tratamento de dados de menores segue as regras da lei, incluindo o consentimento do encarregado de educação quando aplicável.' },
      ]}
    />
  );
}

export function Direitos() {
  return (
    <PaginaLegal
      titulo="Direitos de autor e remoção"
      outras={ligacoes('direitos')}
      seccoes={[
        { titulo: 'Respeitamos os direitos de autor', texto: 'O conteúdo publicado na Kombinu deve ser do próprio autor ou ter autorização para ser partilhado (Lei n.º 15/14, Direitos de Autor e Conexos).' },
        { titulo: 'Pedir a remoção de conteúdo', texto: 'Se achas que um conteúdo viola os teus direitos, contacta-nos com a ligação para o conteúdo e a prova de que és o titular. O canal de contacto será indicado na versão final deste texto.' },
        { titulo: 'O que acontece a seguir', texto: 'Analisamos o pedido e retiramos o conteúdo quando for justificado.' },
      ]}
    />
  );
}
