
# 🗂️ TaskFlow - Gerenciador de Tarefas

Um sistema completo de gerenciamento de tarefas desenvolvido com **HTML, CSS, JavaScript e Bootstrap**, com foco em produtividade, organização e experiência do usuário.

<p align="center">
  <img src="assets/demo-taskflow.gif" width="800" alt="Demonstração do TaskFlow">
</p>

---

## 📁 Estrutura do Projeto

```
TaskFlow/
├── index.html              # Página principal de entrada/login
├── login.html              # Página de login dedicada (opcional)  
├── dashboard.html          # Dashboard principal da aplicação
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos customizados
│   └── js/
│       ├── auth.js         # Sistema de autenticação
│       └── app.js          # Lógica principal do dashboard
└── README.md               # Documentação do projeto
```

---

## 🚀 Funcionalidades Principais

### ✅ Sistema de Autenticação
- Login e cadastro de usuários
- Validação de formulários em tempo real
- Autenticação persistente ("Remember Me")
- Redirecionamento automático e validação de sessão

### ✅ Dashboard Interativo
- Visão geral das tarefas e produtividade
- Estatísticas em tempo real
- Gráficos dinâmicos com Chart.js
- Cards informativos com status

### ✅ Gerenciamento de Tarefas
- CRUD completo (Criar, Ler, Atualizar, Deletar)
- Filtros por status, prioridade e categoria
- Busca rápida por palavras-chave
- Sistema de prioridades e controle de prazos

### ✅ Interface e Experiência
- Design moderno e responsivo (mobile-first)
- Tema claro/escuro com alternância dinâmica
- Sidebar fixa e colapsível
- Animações suaves e notificações visuais
- Utilização de Bootstrap 5 para padronização visual

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** – Estrutura das páginas
- **CSS3** – Estilização personalizada
- **JavaScript ES6+** – Lógica do sistema
- **Bootstrap 5.3.2** – Framework visual
- **Bootstrap Icons** – Ícones integrados
- **Chart.js 4.4.0** – Gráficos e estatísticas
- **LocalStorage / SessionStorage** – Persistência de dados no navegador

---

## 📱 Fluxo de Navegação

1. **`index.html`**  
   - Página inicial com login e redirecionamento inteligente
2. **`dashboard.html`**  
   - Painel completo de gerenciamento e estatísticas
3. **`login.html`** *(opcional)*  
   - Tela exclusiva para login de usuários

---

## 🎯 Como Usar

### 👤 Login de Teste
- **Email:** `admin@taskflow.com`
- **Senha:** `admin123`

Ou crie qualquer conta com email válido e senha com 6+ caracteres.

### 🔄 Navegação
- Use a sidebar para navegar pelas seções
- Crie tarefas com o botão "Nova Tarefa"
- Filtre tarefas, acompanhe estatísticas e edite conforme necessário

---

## 🔧 Configuração e Personalização

### 📂 Usuários de Demonstração (`auth.js`)
```javascript
// Admin user
email: admin@taskflow.com
password: admin123
```

### 📝 Tarefas de Exemplo (`app.js`)
- Tarefas iniciais são geradas automaticamente

### 🎨 Customização Visual
- Alterar variáveis CSS em `style.css` para personalizar cores, temas e estilos
- Adicionar novas categorias no formulário de criação

---

## ✅ Funcionalidades Já Implementadas

- Sistema de login/logout
- Dashboard com estatísticas
- CRUD completo de tarefas
- Filtros e busca por tarefas
- Gráficos interativos
- Tema claro/escuro
- Validação de formulários
- Persistência no navegador
- Interface responsiva
- Sidebar fixa e colapsível
- Notificações visuais

---

## 🔮 Funcionalidades Futuras

- Categorias personalizadas pelo usuário
- Visualização em calendário
- Relatórios exportáveis
- Colaboração multiusuário
- Integração com API backend
- Notificações push com lembretes

---

## 🎨 Temas e Acessibilidade

- Suporte completo a **modo claro/escuro**
- Personalização via CSS custom properties
- Adaptação automática com `matchMedia`

---

## 📱 Responsividade

- Layout mobile-first
- Compatível com smartphones, tablets e desktops
- Componentes adaptáveis e otimizados para toque

---

> **TaskFlow** — Organize suas tarefas de forma inteligente, moderna e eficiente! 🎯

## Demonstração

![Image](https://github.com/user-attachments/assets/db092a64-9732-4c3a-9bc5-7371ea4530de)
