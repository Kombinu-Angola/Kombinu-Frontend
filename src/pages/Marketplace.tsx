import { useState, useEffect, useId } from 'react';
import { Link } from 'react-router-dom';

import { contentService } from '../services/contentService';
import type { Content } from '../services/contentService';
import { Icon } from '../components/ui/Icon';
import { button3DClasses } from '../components/ui/Button3D';
import { cn } from '@/lib/utils';

const TODOS = 'Todos';

/**
 * Página principal de funcionalidades (antigo Marketplace)
 * Lista todos os cursos/conteúdos disponíveis
 */
export default function Marketplace() {
  const searchId = useId();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(TODOS);
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await contentService.getAll();
        setContents(Array.isArray(data) ? data : []);
        const cats = await contentService.getCategories();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (error) {
        console.error("Failed to fetch content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === TODOS || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div
          className="size-12 animate-spin rounded-full border-b-2 border-primary"
          role="status"
          aria-label="A carregar conteúdos"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-surface-ink px-4 py-12 text-white md:px-6 md:py-16">
        <div className="mx-auto max-w-[1280px]">
          <h1 className="max-w-3xl font-montserrat text-headline-h1-mobile text-balance md:text-display-l">
            Explore conhecimento sem limites
          </h1>
          <p className="mt-3 max-w-2xl text-body-lg text-white/75">
            Encontre os melhores cursos e quizzes gamificados para impulsionar a sua carreira.
          </p>

          {/* Barra de pesquisa */}
          <div role="search" className="mt-6 max-w-xl">
            <label htmlFor={searchId} className="sr-only">
              Pesquisar conteúdos
            </label>
            <div className="relative">
              <Icon name="search" size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/60" />
              <input
                id={searchId}
                type="search"
                placeholder="O que você quer aprender hoje?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-h-12 w-full rounded-full border-2 border-white/25 bg-white/10 pr-4 pl-12 text-body-md text-white placeholder:text-white/60 transition-[border-color,background-color] duration-150 focus:border-white focus:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <div className="sticky top-16 z-40 border-b-2 border-border-cloud bg-surface-canvas md:top-20">
        <div
          role="group"
          aria-label="Categoria"
          className="mx-auto flex max-w-[1280px] items-center gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:px-6"
        >
          {[TODOS, ...categories].map((categoria) => {
            const active = selectedCategory === categoria;
            return (
              <button
                key={categoria}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCategory(categoria)}
                className={cn(
                  'min-h-11 shrink-0 rounded-full border-2 px-4 text-body-md font-bold whitespace-nowrap transition-[background-color,border-color,color,translate,box-shadow] duration-150',
                  active
                    ? 'border-brand-ocean bg-brand-ocean text-white shadow-3d-primary active:translate-y-1 active:shadow-none'
                    : 'border-border-cloud bg-surface-canvas text-text-secondary hover:border-brand-ocean hover:text-primary',
                )}
              >
                {categoria === TODOS ? 'Todos' : contentService.getCategoryLabel(categoria)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        <p role="status" className="mb-5 text-body-md text-text-secondary">
          {filteredContents.length === 1 ? '1 conteúdo' : `${filteredContents.length} conteúdos`}
        </p>

        {/* Estado vazio */}
        {filteredContents.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border-input p-10 text-center">
            <p className="text-headline-h3 text-on-surface">Nenhum conteúdo encontrado</p>
            <p className="mt-1 text-body-md text-text-secondary">
              Tente pesquisar por outros termos ou mudar a categoria.
            </p>
          </div>
        ) : (
          <>
            <h2 className="sr-only">Conteúdos disponíveis</h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContents.map((conteudo) => {
                const gratuito = (conteudo.price || 0) === 0;
                return (
                  <li key={conteudo.id}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border-cloud bg-surface-canvas shadow-elevation-1 transition-[translate,box-shadow,border-color] duration-200 ease-out-quint hover:-translate-y-1 hover:border-brand-ocean hover:shadow-clay has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand-sky-ink">
                      {/* Miniatura */}
                      <div className="relative h-44 overflow-hidden bg-surface-soft">
                        <img
                          src={conteudo.thumbnail}
                          alt=""
                          className="size-full object-cover transition-[scale] duration-500 ease-out-quint group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-surface-canvas px-2.5 py-0.5 text-caption font-bold text-text-secondary">
                          {contentService.getCategoryLabel(conteudo.category)}
                        </span>
                        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-surface-canvas px-2.5 py-0.5 text-caption font-bold text-on-surface tabular-nums">
                          <Icon name="star" size={14} className="fill-feedback-streak text-feedback-streak" />
                          {conteudo.rating}
                          <span className="sr-only">de 5</span>
                        </span>
                      </div>

                      {/* Informações */}
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="font-montserrat text-headline-h3 leading-snug font-extrabold text-on-surface line-clamp-2">
                          {conteudo.title}
                        </h3>
                        <p className="mt-2 mb-4 text-body-md text-text-secondary line-clamp-3">
                          {conteudo.description}
                        </p>

                        <div className="mt-auto mb-4 flex items-center justify-between border-t-2 border-border-cloud pt-3 text-caption text-text-secondary">
                          <span className="flex items-center gap-1.5">
                            <Icon name="clock" size={16} />
                            {conteudo.duration}
                          </span>
                          <span className="flex items-center gap-1.5 tabular-nums">
                            <Icon name="users" size={16} />
                            {conteudo.students} alunos
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={cn(
                              'font-montserrat text-headline-h3 font-extrabold tabular-nums',
                              gratuito ? 'text-feedback-success-ink' : 'text-on-surface',
                            )}
                          >
                            {gratuito ? 'Gratuito' : `Kz ${(conteudo.price || 0).toLocaleString()}`}
                          </span>
                          <Link
                            to={`/courses/${conteudo.id}`}
                            className={cn(
                              button3DClasses({ size: 'md' }),
                              'outline-none after:absolute after:inset-0 after:content-[""]',
                            )}
                          >
                            Ver detalhes
                            <span className="sr-only">: {conteudo.title}</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
