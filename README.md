# 💰 Controle Financeiro - Aplicativo Local

Um aplicativo completo de controle financeiro pessoal desenvolvido com Next.js, React e TypeScript. Gerencie suas receitas, despesas, categorias e visualize relatórios detalhados com gráficos interativos.

## ✨ Funcionalidades

- 📊 **Dashboard Completo**: Visão geral das suas finanças com gráficos interativos
- 💸 **Gestão de Transações**: Adicione, edite e exclua receitas e despesas
- 🏷️ **Categorias Personalizadas**: Crie categorias com cores e orçamentos
- 📈 **Relatórios Visuais**: Gráficos de pizza, barras e comparativos mensais
- 🌙 **Tema Escuro/Claro**: Interface adaptável ao seu gosto
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 📄 **Exportação PDF**: Gere relatórios em PDF das suas transações
- 🎯 **Alertas de Orçamento**: Notificações quando exceder limites
- 💾 **Armazenamento Local**: Todos os dados ficam no seu computador

## 🚀 Como Instalar e Executar

### Pré-requisitos

Certifique-se de ter instalado em seu computador:
- **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** (vem junto com o Node.js)

### Passo 1: Baixar o Projeto

1. **Opção A - Download ZIP:**
   - Clique no botão "Code" → "Download ZIP"
   - Extraia o arquivo em uma pasta de sua escolha

2. **Opção B - Git Clone:**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd controle-financeiro
   ```

### Passo 2: Instalar Dependências

Abra o terminal/prompt de comando na pasta do projeto e execute:

```bash
npm install
```

Este comando irá baixar e instalar todas as bibliotecas necessárias.

### Passo 3: Executar o Aplicativo

Para iniciar o aplicativo em modo de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em: **http://localhost:3000**

### Passo 4: Usar o Aplicativo

1. Abra seu navegador e acesse `http://localhost:3000`
2. Comece adicionando suas primeiras categorias
3. Registre suas receitas e despesas
4. Explore os relatórios e gráficos

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Verifica problemas no código

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones
- **jsPDF** - Geração de PDFs
- **Radix UI** - Componentes acessíveis

## 💾 Armazenamento de Dados

O aplicativo utiliza **localStorage** do navegador para armazenar seus dados. Isso significa que:

- ✅ Todos os dados ficam no seu computador
- ✅ Nenhuma informação é enviada para servidores externos
- ✅ Funciona completamente offline
- ⚠️ Os dados são específicos do navegador usado

### Backup dos Dados

Para fazer backup dos seus dados:
1. Use a função "Exportar PDF" para relatórios
2. Os dados ficam salvos no localStorage do navegador
3. Para migrar dados, você pode exportar/importar via PDF

## 🎯 Como Usar

### 1. Criando Categorias
- Clique em "Nova Categoria"
- Escolha um nome, cor e tipo (receita/despesa)
- Defina um orçamento mensal (opcional)

### 2. Adicionando Transações
- Clique em "Nova Transação"
- Preencha descrição, valor, categoria e data
- Escolha se é receita ou despesa

### 3. Visualizando Relatórios
- Acesse as abas "Visão Geral", "Transações", "Categorias"
- Use o seletor de mês para filtrar períodos
- Visualize gráficos de pizza e barras

### 4. Exportando Relatórios
- Clique em "Exportar PDF"
- Será gerado um relatório do mês selecionado

## 🔧 Personalização

### Alterando Cores do Tema
Edite o arquivo `src/app/globals.css` para personalizar as cores.

### Adicionando Novas Funcionalidades
- Componentes ficam em `src/components/`
- Hooks personalizados em `src/hooks/`
- Utilitários em `src/lib/`

## 🐛 Solução de Problemas

### Erro "npm não encontrado"
- Instale o Node.js do site oficial
- Reinicie o terminal após a instalação

### Erro "porta 3000 em uso"
- Use: `npm run dev -- -p 3001` para usar porta 3001
- Ou feche outros aplicativos usando a porta 3000

### Dados não aparecem
- Verifique se o localStorage está habilitado no navegador
- Tente usar modo anônimo/privado para testar

### Aplicativo não carrega
- Verifique se executou `npm install`
- Certifique-se que o Node.js está atualizado

## 📱 Versão Mobile

O aplicativo é totalmente responsivo e funciona bem em:
- 📱 Smartphones
- 📱 Tablets  
- 💻 Desktops
- 🖥️ Monitores grandes

## 🔒 Privacidade

- ✅ Todos os dados ficam no seu computador
- ✅ Nenhuma informação é enviada para internet
- ✅ Funciona completamente offline
- ✅ Você tem controle total dos seus dados

## 📞 Suporte

Se encontrar problemas:
1. Verifique se seguiu todos os passos de instalação
2. Consulte a seção "Solução de Problemas"
3. Verifique se o Node.js está atualizado

## 📄 Licença

Este projeto é de uso pessoal. Você pode usar, modificar e distribuir livremente.

---

**Desenvolvido com ❤️ para ajudar você a controlar suas finanças!**