# ERP Tek-System — Frontend

Aplicação web desenvolvida como teste técnico para o processo seletivo da **Tek-System**.

O sistema foi desenvolvido em **Vue 3** com **TypeScript** e oferece um módulo ERP completo com gestão de clientes, produtos e pedidos, integrado a uma API REST. A autenticação é feita via JWT com renovação automática do token.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Estrutura de Rotas](#estrutura-de-rotas)

---

## Pré-requisitos

- [Docker](https://www.docker.com/)
- **Backend `tek-system-server` rodando em `http://localhost:3000`** — o front-end depende dele para funcionar. Sem o back-end ativo, login, cadastro e todas as operações retornarão erro.

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd tek-system-frontend-test
```

### 2. Suba o back-end primeiro

Certifique-se de que o servidor `tek-system-server` está rodando em `http://localhost:3000` antes de iniciar o front-end. Consulte o README do repositório da API para instruções.
-> `https://github.com/julia-otomoduarte/tek-system-backend-test`

### 3. Build e inicie o container

**macOS:**

```bash
docker compose up --build
```

**Windows / Linux:**

```bash
docker-compose up --build
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Stack

| Tecnologia   | Versão |
| ------------ | ------ |
| Vue          | 3      |
| TypeScript   | 5      |
| Vuetify      | 4      |
| Pinia        | 3      |
| Vue Router   | 5      |
| Axios        | 1      |
| Tailwind CSS | 4      |
| Iconify      | 5      |
| Chart.js     | 4      |
| Vite         | 7      |

---

## Funcionalidades

### Autenticação

#### Login — `/login`

Formulário de autenticação com **e-mail** e **senha**. Ao realizar login com sucesso, os tokens JWT são armazenados no `localStorage` e o usuário é redirecionado ao dashboard.

- Exibe mensagem de erro caso as credenciais sejam inválidas.
- Usuários já autenticados são redirecionados automaticamente ao dashboard.

#### Cadastro — `/register`

Formulário de criação de conta com os campos **nome**, **e-mail** e **senha**.

- Ao concluir, redireciona automaticamente para o dashboard.

---

### Dashboard — `/dashboard`

Página inicial do sistema com visão geral das principais métricas do ERP.

---

### Clientes — `/customers`

#### Listagem — `/customers`

Tabela paginada com todos os clientes cadastrados. Cada linha exibe nome, e-mail, telefone e documento.

- **Filtros rápidos** (acima da tabela): nome, e-mail.
- **Filtros avançados** (painel lateral): telefone, documento, estado e cidade (cidade habilitada após seleção do estado).
- Badge indica a quantidade de filtros avançados ativos.
- Ações por linha: editar e excluir.

#### Cadastro / Edição — `/customers/create` e `/customers/:id`

Formulário completo com os campos: nome, e-mail, telefone, documento (CPF/CNPJ), CEP, endereço, bairro, complemento, estado e cidade.

- **Preenchimento automático por CEP**: ao digitar o CEP e clicar fora do input, os campos de endereço, bairro, cidade e estado são preenchidos automaticamente via API do ViaCEP.
- Estado e cidade são selecionados via listas dinâmicas (a lista de cidades é carregada conforme o estado selecionado).
- Em modo de edição, todos os campos são pré-preenchidos com os dados atuais.

---

### Produtos — `/products`

#### Listagem — `/products`

Tabela paginada com todos os produtos cadastrados. Cada linha exibe nome, SKU, preço e estoque.

- **Filtros rápidos**: nome, SKU.
- **Filtros avançados**: faixa de preço (preço mínimo e máximo).
- Ações por linha: editar e excluir.

#### Cadastro / Edição — `/products/create` e `/products/:id`

Formulário com os campos: nome, SKU, descrição, preço e estoque.

- Campo de preço com máscara de moeda brasileira (R$).
- Em modo de edição, todos os campos são pré-preenchidos com os dados atuais.

---

### Pedidos — `/orders`

#### Listagem — `/orders`

Tabela paginada com todos os pedidos. Cada linha exibe número do pedido, cliente (nome e e-mail), status e valor total.

- **Filtros rápidos**: número do pedido, status (select com chip colorido).
- **Filtros avançados**: cliente (autocomplete com busca por nome), faixa de valor total.
- Status com cores distintas: Rascunho (cinza), Pendente (azul), Concluído (verde), Cancelado (vermelho).
- Ações por linha: visualizar (sempre), editar (apenas Rascunho e Pendente), excluir (apenas Rascunho e Pendente).

#### Cadastro / Edição — `/orders/create` e `/orders/:id/edit`

Formulário com seleção de cliente (autocomplete com busca) e lista dinâmica de itens.

- Adicione e remova itens do pedido livremente.
- Cada item possui seleção de produto (autocomplete), quantidade e preço unitário (preenchido automaticamente ao selecionar o produto).
- O valor total é calculado em tempo real conforme os itens são adicionados.
- O preço unitário exibido serve apenas para simulação — o preço final é determinado pelo back-end no momento do cadastro.
- Em modo de edição, todos os dados do pedido e seus itens são carregados automaticamente.

#### Detalhe — `/orders/:id`

Exibe todas as informações do pedido em layout de duas colunas: dados do pedido e dados do cliente.

- Tabela de itens com SKU, produto, quantidade, preço unitário, subtotal e total.
- **Alterar Status**: botão que abre um modal para transição de status. Apenas transições válidas são exibidas:
  - Rascunho → Pendente
  - Pendente → Concluído ou Cancelado
- O botão é ocultado para pedidos já Concluídos ou Cancelados.
- O nome do cliente é um link direto para a edição do cadastro do cliente.

---

### Perfil — `/profile`

Página do usuário autenticado com avatar de iniciais, formulário de atualização de dados pessoais e alteração de senha.

- **Informações pessoais**: nome e e-mail.
- **Alterar senha**: campo opcional — deixe em branco para manter a senha atual.
- Após salvar, os dados são atualizados no estado global da aplicação.
- Botão de logout disponível na página de perfil e na barra superior.

---

### Página 404

Exibida para qualquer rota inexistente. O botão de retorno redireciona para o dashboard.

---

## Estrutura de Rotas

```
/login                  → Login
/register               → Cadastro

/dashboard              → Dashboard                    (autenticado)

/customers              → Listagem de Clientes         (autenticado)
/customers/create       → Cadastrar Cliente            (autenticado)
/customers/:id          → Editar Cliente               (autenticado)

/products               → Listagem de Produtos         (autenticado)
/products/create        → Cadastrar Produto            (autenticado)
/products/:id           → Editar Produto               (autenticado)

/orders                 → Listagem de Pedidos          (autenticado)
/orders/create          → Criar Pedido                 (autenticado)
/orders/:id             → Detalhe do Pedido            (autenticado)
/orders/:id/edit        → Editar Pedido                (autenticado)

/profile                → Meu Perfil                   (autenticado)

*                       → Página não encontrada (404)
```
