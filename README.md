# 🧠 MindTask

Aplicativo fullstack de organização pessoal que permite salvar ideias, organizar projetos por grupos e acompanhar tarefas com status. Ideal para desenvolvedores que querem tirar ideias do papel com praticidade e foco.

🔗 **Live Site**: [https://mindtask-fawn.vercel.app/](https://mindtask-fawn.vercel.app/)

⚠️ O backend está hospedado no **Railway** e utiliza **SQL Server** como banco de dados.

---

## 📁 Estrutura Geral do Repositório

```
mindtask/
├── backend/        # API REST em Node.js
├── frontend/       # Interface em Next.js com Tailwind
└── consultas/      # Scripts SQL de criação de tabelas e dados iniciais
```

### 📜 Pastas de Consultas SQL

A pasta `consultas/` contém scripts úteis para inicialização do banco de dados:

* `create_tables.sql` → Criação das tabelas utilizadas pelo sistema
* `insert_tecnologias.sql` → Inserção inicial de tecnologias disponíveis

---

## ⚙️ Tecnologias Utilizadas

### 🔧 Backend

* Node.js + Express
* SQL Server
* JWT (autenticação)
* bcrypt (hash de senhas)
* dotenv
* CORS

### 💻 Frontend

* React (Next.js App Router com `use client`)
* Tailwind CSS
* TypeScript
* shadcn/ui
* dnd-kit (drag and drop para grupos e projetos)
* localStorage e cookies (persistência de sessão e preferências)

---

## 🚀 Como Rodar o Projeto Localmente

### 1. Clone o Repositório

```bash
git clone https://github.com/kaiqueGeraldo/mindtask.git
cd mindtask
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

A API estará disponível em: `http://localhost:3001`

> ⚠️ Configure suas variáveis de ambiente no arquivo `.env` com as credenciais do SQL Server.

### 3. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Acesse o frontend em: `http://localhost:3000`

---

## 📂 Estrutura de Arquivos

### 🔙 Backend (`/backend`)

Organizado de forma modular seguindo boas práticas:

```
backend/
├── src/
│   ├── config/       # Configuração da conexão com o banco de dados
│   ├── controllers/  # Lógica das rotas (auth, projetos, grupos, tarefas)
│   ├── middleware/   # Middlewares de autenticação e validação
│   ├── models/       # Modelos e queries SQL
│   ├── routes/       # Definição das rotas da API
│   ├── services/     # Lógica de negócio reutilizável
│   ├── server.js     # Ponto de entrada da API Express
```

### 🖥️ Frontend (`/frontend`)

Estrutura escalável e organizada por responsabilidades:

```
frontend/
├── src/
│   ├── app/              # Estrutura de rotas do Next.js
│   │   ├── (public)/     # Rotas públicas (login, cadastro, etc.)
│   │   └── (private)/    # Rotas protegidas (dashboard, projetos)
│   ├── components/       # Componentes reutilizáveis (Navbar, Inputs, Modais)
│   ├── context/          # Contextos globais (auth, sidebar, modal)
│   ├── dispatcher/       # Dispatcher de ações do menu de contexto
│   ├── hooks/            # Hooks personalizados (drag and drop, edição inline)
│   ├── layouts/          # Layouts principais (Privado, Público)
│   ├── lib/              # Utilitários auxiliares (cookies, axios, etc.)
│   ├── lottie/           # Animações Lottie
│   ├── models/           # Tipagens e modelos do frontend
│   ├── screens/          # Telas principais (Home, Projeto, Login)
│   ├── service/          # Serviços de comunicação com a API
│   ├── utils/            # Funções utilitárias gerais
│   └── validators/       # Validações de formulários e dados
```

---

## 🔍 Funcionalidades

* Criar, editar e excluir **projetos**, **grupos** e **tarefas**
* Marcar tarefas com status: *não iniciada*, *em andamento* ou *concluída*
* Salvar ideias soltas ou organizá-las em grupos
* **Favoritar projetos** e exibir na seção destacada
* Reorganização com **drag and drop** entre grupos e dentro dos grupos
* Edição inline de nomes de grupos e projetos
* Autenticação com suporte a **contas vinculadas**
* Interface moderna, responsiva e altamente interativa

---

## 📌 Como Funciona

1. Usuário se cadastra ou faz login
2. Pode criar grupos, projetos e tarefas personalizadas
3. As ações são enviadas para a API em Node.js e salvas no SQL Server
4. O frontend em Next.js atualiza a interface em tempo real com base nas interações
5. Preferências como favoritos são armazenadas no `localStorage`

---

## 🖼️ Screenshots

📸 *Imagens ilustrativas do sistema:*

* Dashboard com grupos e projetos
* Tela de tarefas com animações de abas (status)
* Modal de criação de ideias e tarefas
* Login com troca de contas vinculadas

---

## ✅ Requisitos

* Node.js 18 ou superior
* npm
* SQL Server (local ou hospedado)

---

## 📝 Licença

Este projeto está licenciado sob a **Licença MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ❤️ por **Kaique Geraldo**
[LinkedIn](https://www.linkedin.com/in/kaique-geraldo/) | [GitHub](https://github.com/kaiqueGeraldo) | [Email](mailto:kaiique2404@gmail.com)
