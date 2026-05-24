<!-- markdownlint-disable MD041 -->

## O que foi feito

<!-- Descreve claramente o que foi implementado ou corrigido neste PR. Seja especifico e objectivo. -->

## Motivacao

<!-- Contexto e razao da mudanca. Referencia o ID da tarefa do sprint (ex: S1-06) se aplicavel. -->

**Tarefa de referencia:** <!-- ex: S1-06 - Actualizar paleta de cores no Tailwind -->

## Como testar

<!-- Passos claros e reproduziveis para o reviewer testar manualmente. Este campo e obrigatorio. -->

1. Fazer checkout da branch: `git checkout <nome-da-branch>`
2. Instalar dependencias, se necessario: `npm install`
3. Iniciar o projecto: `npm run dev`
4. Navegar para `http://localhost:5173/...`
5. (continuar com os passos especificos da feature)

## Screenshots

<!-- Obrigatorio para qualquer mudanca visual. Incluir imagens de Antes e Depois. -->
<!-- Para mudancas apenas de logica ou backend sem alteracao visual, escrever "Nao aplicavel". -->

**Desktop:**

| Antes               | Depois              |
| ------------------- | ------------------- |
| _inserir screenshot_ | _inserir screenshot_ |

**Mobile (375px):**

| Antes               | Depois              |
| ------------------- | ------------------- |
| _inserir screenshot_ | _inserir screenshot_ |

## Checklist do Developer

Confirmo que verifiquei todos os itens abaixo antes de submeter este PR:

- [ ] O codigo compila sem erros (`npm run build` passou com sucesso)
- [ ] Sem erros ou warnings relevantes na consola do browser
- [ ] Testado no browser desktop (Chrome e/ou Firefox)
- [ ] Testado em resolucao mobile (375px de largura minima)
- [ ] Dark mode verificado em todos os elementos alterados
- [ ] Nenhuma credencial, token ou variavel de ambiente hard-coded no codigo
- [ ] Sem `console.log()` esquecidos (usar `src/utils/logger.ts` para debug)
- [ ] Sem blocos de codigo comentado deixados para tras
- [ ] `CHANGELOG.md` actualizado com a descricao desta alteracao
- [ ] Branch sincronizada com `develop` antes de abrir o PR (`git rebase origin/develop`)
- [ ] PR esta a ser feito para a branch `develop` (nao para `main`)

---

Este PR segue os padroes definidos no SLA Frontend KOMBINU — AngoTic 2025.
