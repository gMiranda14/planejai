Planej.ai

Simulador de planejamento financeiro com diagnóstico gerado por IA. O usuário informa sua renda, gastos, dívidas e uma meta financeira (ex: comprar um carro, fazer uma viagem), e o app calcula a viabilidade da meta e gera um plano de ação personalizado — incluindo um chat para tirar dúvidas adicionais sobre o próprio diagnóstico.

O que o projeto faz
Coleta os dados financeiros do usuário em um formulário guiado, passo a passo (renda, custos fixos, dívidas, nome da meta, custo da meta e prazo desejado)
Calcula a economia mensal disponível e a economia mensal necessária para atingir a meta no prazo informado
Envia esses dados para uma IA, que retorna um diagnóstico financeiro estruturado: viabilidade da meta, análise do orçamento, sugestões práticas, ideias de renda extra, sugestões de investimento e uma mensagem motivacional
Permite conversar com a IA sobre o diagnóstico gerado, fazendo perguntas de acompanhamento ilimitadas
Salva todas as simulações no navegador (localStorage), com uma página de histórico para consultar, revisitar ou excluir simulações anteriores
Interface responsiva, com suporte a tema claro/escuro
Como executar a aplicação

Pré-requisitos: Node.js 18+ e pnpm instalados.

bash

# 1. Clone o repositório

git clone https://github.com/gMiranda14/planejai.git
cd planejai

# 2. Instale as dependências

pnpm install

Crie um arquivo .env.local na raiz do projeto com o seguinte conteúdo:

VITE_GROQ_API_KEY=sua_chave_aqui

Você pode gerar uma chave gratuita em console.groq.com/keys (não exige cartão de crédito).

bash

# 3. Rode o projeto em modo de desenvolvimento

pnpm run dev

O app estará disponível em http://localhost:5173.

Quais tecnologias foram usadas
React 19 + TypeScript — base da aplicação
Vite — bundler e servidor de desenvolvimento
React Router — navegação entre as páginas (formulário, resultado, histórico)
Tailwind CSS — estilização, com suporte a tema claro/escuro via variáveis CSS
Lucide React — ícones
react-loading-skeleton — feedback de carregamento
Groq API (modelo openai/gpt-oss-20b) — geração do diagnóstico financeiro e das respostas do chat, via requisições fetch diretas (API compatível com o padrão da OpenAI)
localStorage — persistência das simulações e das conversas, sem necessidade de backend
Qual melhoria você implementou

Implementei o desafio "Conversa com o Mentor": um campo de chat dentro do card de insight financeiro, que permite ao usuário fazer perguntas de acompanhamento sobre o diagnóstico gerado (ex: "como posso ganhar uma renda extra para atingir minha meta?").

Principais pontos da implementação:

O chat reaproveita o contexto da simulação e do diagnóstico já gerado, então as respostas são consistentes com os números e a meta do usuário, sem repetir informação genérica.

Histórico de perguntas e respostas fica visível na tela, com scroll interno que rola automaticamente para o final sempre que uma nova mensagem chega.

Feedback de carregamento (efeito de "digitando") enquanto a IA responde, e mensagem de erro caso a requisição falhe.

Toda a conversa é salva no localStorage, atrelada à simulação, então ao voltar para a página de resultado (inclusive pelo histórico) a conversa anterior continua lá.

Também implementei a página de Histórico de Simulações, com cards responsivos mostrando o resumo de cada simulação salva, opção de excluir e link para revisitar os resultados completos.

Como testar o fluxo principal:
Na tela inicial, preencha o formulário com sua renda, gastos, dívidas e a meta que deseja atingir (nome, valor e prazo em meses)
Ao concluir, você será redirecionado para a página de resultado, onde os dados calculados aparecem nos cards e o diagnóstico da IA é gerado automaticamente.

No card "Insight Financeiro Personalizado", use o campo no rodapé para fazer uma pergunta sobre o diagnóstico (ex: "quais investimentos são mais seguros para minha meta?") e veja a resposta aparecer no histórico da conversa.

Clique em "Histórico" no menu superior para ver todas as simulações já feitas, testar a exclusão de uma delas, e usar "Ver detalhes" para voltar a uma simulação específica (com o diagnóstico e a conversa já salvos).

O que você aprendeu durante o desafio:

Como lidar com a instabilidade de provedores de IA em produção: durante o desenvolvimento, enfrentei um bug real do Google (migração das chaves do Gemini para um novo formato que ainda não funciona via API REST simples), o que me obrigou a migrar toda a integração para outro provedor (Groq) sem quebrar o restante da aplicação — isso reforçou a importância de isolar a lógica de IA em uma camada própria (aiService.ts), fácil de trocar sem afetar o resto do código.

Depuração sistemática de erros de rede (401, 400, 404), lendo o corpo da resposta da API em vez de só o status HTTP, para identificar a causa raiz real em vez de tentar soluções aleatórias.

Gerenciamento de variáveis de ambiente no Vite (import.meta.env, arquivos .env.local) e problemas comuns como arquivo não existente no disco, nome de variável incorreto e necessidade de reiniciar o servidor após qualquer mudança.

Persistência de dados no localStorage sem backend, incluindo tratamento de dados duplicados/incompletos para não quebrar a interface

Como estruturar prompts de IA para retornar JSON estruturado de forma confiável (response_format: json_object) e como reforçar instruções de formatação (evitar markdown cru) quando a IA não segue a regra na primeira tentativa.
