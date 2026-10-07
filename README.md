<div align="center">

<img src="https://github.com/user-attachments/assets/c3dbb924-e2e6-4629-a864-30fbb0736c65" alt="PitZone Logo" width="250"/>

# 🏁 PitZone

### A plataforma completa para fãs de Fórmula 1.

<p>
  <strong>Informação • Fantasy • Competição • Gamificação • Comunidade • Loja</strong>
</p>

<p>
  <img src="https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black" alt="React Native"/>
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License"/>
</p>

<p>
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-identidade-visual">Design</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-como-rodar">Como rodar</a> •
  <a href="#-status-do-projeto">Status</a>
</p>

</div>

---

## 📖 Sobre o projeto

**PitZone** é uma plataforma mobile criada para centralizar a experiência dos fãs de **Fórmula 1** em um único aplicativo.

Atualmente, o fã precisa utilizar diferentes plataformas para acompanhar corridas, consultar estatísticas, participar de Fantasy, competir com amigos, acompanhar notícias e comprar produtos relacionados à categoria.

O PitZone propõe uma experiência integrada:

> **Acompanhe a Fórmula 1. Monte sua equipe. Compita com seus amigos. Conquiste seu espaço.**

A plataforma reúne:

* 🏎️ Informações e estatísticas de Fórmula 1
* 📰 Notícias e conteúdos
* 🏆 Fantasy Game
* 👥 Ligas entre amigos
* 📊 Rankings
* 🎖️ Conquistas e gamificação
* 👤 Perfil e histórico do usuário
* 🛒 Loja de produtos e colecionáveis
* 🔥 Autenticação e persistência de dados com Firebase

### 🎯 Proposta de valor

O PitZone conecta diferentes momentos da experiência do fã em uma única jornada:

```text
Próxima corrida
      ↓
Informações da corrida
      ↓
Pilotos e equipes
      ↓
Fantasy
      ↓
Pontuação
      ↓
Ranking
      ↓
Liga com amigos
      ↓
Conquistas
      ↓
Loja
      ↓
PitZone+
```

---

# 💡 Problema

A experiência do fã de Fórmula 1 é frequentemente fragmentada.

Para acompanhar completamente a categoria, normalmente é necessário utilizar diferentes plataformas para:

* consultar o calendário;
* acompanhar resultados;
* consultar pilotos e equipes;
* acompanhar notícias;
* participar de Fantasy;
* competir com amigos;
* acompanhar rankings;
* comprar produtos relacionados à categoria.

Essa fragmentação dificulta a criação de uma experiência contínua.

## 💭 Solução

O PitZone concentra essas funcionalidades em uma única plataforma mobile, criando uma experiência mais simples, social e gamificada.

---

# 👥 Público-alvo

O aplicativo foi pensado para diferentes níveis de fãs.

### 🟢 Novo fã

Pessoa que começou a acompanhar Fórmula 1 recentemente e precisa de informações organizadas para entender a categoria.

### 🟡 Fã casual

Usuário que acompanha corridas, pilotos e equipes, mas não necessariamente acompanha todos os detalhes da temporada.

### 🔴 Fã hardcore

Usuário que acompanha estatísticas, resultados, Fantasy, rankings, ligas e outros conteúdos relacionados à categoria.

---

# 📱 Funcionalidades

## 🏠 Home

A tela inicial funciona como o principal hub da experiência.

Inclui:

* Próxima corrida
* Countdown
* Informações do circuito
* Minha equipe Fantasy
* Pontuação atual
* Ranking
* Notícias em destaque
* Atalhos para as principais áreas

---

## 🏎️ Fórmula 1

Área dedicada às informações da categoria.

### Calendário

* Temporada
* Etapas
* Datas
* Circuitos
* Status das corridas

### Corridas

As corridas podem apresentar:

* Nome do GP
* Circuito
* País
* Data
* Horários
* Resultados
* Classificação
* Informações da etapa

### Pilotos

Informações como:

* Nome
* Número
* Nacionalidade
* Equipe
* Estatísticas
* Resultados
* Histórico

### Equipes

Informações como:

* Nome
* Pilotos
* Resultados
* Pontuação
* Classificação

### Classificação

* Pilotos
* Construtores
* Temporada
* Resultados por corrida

---

# 🏆 Fantasy

O Fantasy é um dos principais recursos de gamificação do PitZone.

O usuário cria sua própria equipe respeitando um orçamento virtual e acompanha o desempenho da equipe ao longo da temporada.

## Composição da equipe

A equipe Fantasy é composta por:

* 👤 2 pilotos
* 🏎️ 1 construtor
* 👔 1 chefe de equipe

## Fluxo de criação

```text
1. Escolha dos pilotos
        ↓
2. Escolha do construtor
        ↓
3. Escolha do chefe de equipe
        ↓
4. Validação do orçamento
        ↓
5. Confirmação da equipe
```

## 💰 Sistema de orçamento

O PitZone já possui a **modelagem do orçamento do Fantasy**.

O sistema considera o valor dos componentes selecionados para validar se a equipe está dentro do orçamento disponível.

```text
Orçamento disponível
        │
        ├── Piloto 1
        ├── Piloto 2
        ├── Construtor
        └── Chefe de equipe
                 │
                 ▼
         Soma dos valores
                 │
                 ▼
        Validação do limite
```

Caso o valor total ultrapasse o orçamento disponível, a equipe não pode ser confirmada até que uma alteração seja realizada.

## 📊 Sistema de pontuação

O PitZone também já possui a **modelagem do cálculo de pontuação do Fantasy**.

A pontuação é calculada a partir do desempenho dos integrantes da equipe durante uma corrida.

A estrutura permite considerar diferentes eventos de desempenho, como:

* posição de largada;
* posição final;
* vitória;
* pódio;
* pole position;
* ultrapassagens;
* volta mais rápida;
* desempenho do construtor;
* abandonos;
* demais critérios definidos pela regra do Fantasy.

Fluxo conceitual:

```text
Resultado da corrida
        ↓
Dados do piloto / equipe
        ↓
Regras de pontuação
        ↓
Pontuação individual
        ↓
Pontuação da equipe Fantasy
        ↓
Ranking
```

Isso permite que o desempenho do usuário seja transformado em pontuação acumulada para rankings e ligas.

---

# 👥 Ligas

O sistema de ligas permite criar competições privadas entre usuários.

### Funcionalidades

* Criar liga
* Entrar em liga
* Código de convite
* Ranking da liga
* Pontuação acumulada
* Competição entre amigos

### Exemplo

```text
🏆 Liga: Amigos da FIAP

1º Gabriel       842 pts
2º Augusto       801 pts
3º Gustavo       764 pts
4º Convidado     711 pts
```

---

# 📊 Rankings

O PitZone possui diferentes possibilidades de classificação:

* 🌎 Ranking global
* 🇧🇷 Ranking Brasil
* 👥 Ranking de amigos
* 🏆 Ranking de ligas
* 🏁 Ranking por corrida
* 📅 Ranking da temporada

---

# 🎖️ Conquistas

O sistema de conquistas adiciona uma camada de gamificação à experiência.

Exemplos:

| Conquista             | Descrição                               |
| --------------------- | --------------------------------------- |
| 🏁 Primeira Corrida   | Acompanhar a primeira corrida           |
| 🏆 Primeira Vitória   | Vencer uma etapa no Fantasy             |
| 👥 Primeiro Rival     | Entrar em uma liga                      |
| 🥇 Campeão da Liga    | Terminar uma liga em primeiro           |
| 🚀 Pole Position      | Alcançar uma pontuação especial         |
| 🔥 Sequência Perfeita | Manter uma sequência de bons resultados |

A estrutura foi pensada para permitir a expansão do sistema com novas conquistas.

---

# 👤 Perfil

Cada usuário possui um perfil próprio com informações como:

* Nome
* Foto
* Pontuação
* Estatísticas
* Histórico Fantasy
* Ligas
* Conquistas
* Equipes criadas
* Configurações da conta

---

# 🛒 Loja

O PitZone possui uma área de comércio integrada à experiência do usuário.

### Categorias

* 👕 Vestuário
* 🧢 Acessórios
* 🏎️ Colecionáveis
* 🏁 Produtos relacionados à Fórmula 1

### Fluxo de compra

```text
Produto
   ↓
Detalhes
   ↓
Carrinho
   ↓
Entrega
   ↓
Pagamento
   ↓
Confirmação
```

## 💳 Simulação de pagamento

O projeto já possui um **fluxo de pagamento simulado**.

A experiência reproduz as principais etapas de um checkout:

```text
Carrinho
   ↓
Dados de entrega
   ↓
Método de pagamento
   ↓
Validação
   ↓
Processamento simulado
   ↓
Pagamento aprovado
   ↓
Confirmação do pedido
```

A funcionalidade foi desenvolvida para demonstrar o fluxo completo de compra dentro do aplicativo, sem representar uma integração real com uma operadora ou gateway financeiro.

## 🛍️ Carrinho

O estado do carrinho é compartilhado entre as telas através do:

```text
CartContext
```

Isso permite:

* adicionar produtos;
* remover produtos;
* alterar quantidade;
* consultar subtotal;
* manter os itens durante a navegação;
* seguir para o checkout.

---

# 🎨 Identidade visual

O PitZone utiliza uma identidade visual inspirada em interfaces esportivas premium e no universo da Fórmula 1.

## 🎨 Paleta

| Elemento             | Cor       |
| -------------------- | --------- |
| Fundo principal      | `#0B0E14` |
| Fundo secundário     | `#0D1117` |
| Cards                | `#151A24` |
| Superfícies          | `#1A1F2B` |
| Vermelho principal   | `#E10600` |
| Vermelho de destaque | `#FF1E1E` |
| Texto principal      | `#FFFFFF` |
| Texto secundário     | `#9AA3B2` |
| Bordas               | `#262C38` |

## Tipografia

### Títulos e números

Referência:

* Titillium Web
* Tipografia condensada
* Alto impacto visual

### Texto

Referência:

* Inter
* Alta legibilidade

## Elementos recorrentes

* Cards escuros
* Bordas discretas
* Alto contraste
* Glow em elementos de destaque
* Vermelho como cor de ação
* Ícones esportivos
* Tab bar inferior
* Componentes com aparência premium

## Navegação principal

```text
┌──────────────────────────────────────┐
│                                      │
│              PITZONE                 │
│                                      │
│           Conteúdo da tela           │
│                                      │
├──────────────────────────────────────┤
│ 🏠    🏎️    🏆    🛒    👤           │
│Home    F1 Fantasy Loja Perfil        │
└──────────────────────────────────────┘
```

## 🎨 Protótipo

O projeto possui protótipo desenvolvido no Figma:

👉 [CP - Mobile — Figma](https://www.figma.com/design/tUzTrZiqHeJPLijviiSMSw/CP---Mobile)

---

# 🛠️ Tecnologias

| Camada             | Tecnologia              |
| ------------------ | ----------------------- |
| Framework mobile   | Expo `~57`              |
| Framework UI       | React Native `0.86`     |
| Biblioteca UI      | React `19.2`            |
| Linguagem          | TypeScript `~6.0`       |
| Navegação          | React Navigation 7      |
| Backend / BaaS     | Firebase `^12`          |
| Autenticação       | Firebase Authentication |
| Banco de dados     | Cloud Firestore         |
| Persistência local | AsyncStorage            |
| Estado global      | React Context           |
| Carrinho           | `CartContext`           |
| Blur               | `expo-blur`             |
| Ícones             | `@expo/vector-icons`    |
| SVG                | `react-native-svg`      |
| Qualidade          | ESLint 9                |
| Controle de versão | Git / GitHub            |

---

# 🧱 Arquitetura

A aplicação segue uma arquitetura modular baseada em React Native.

```text
index.ts
   │
   ▼
App.tsx
   │
   ├── CartProvider
   │
   └── Navigation
         │
         ├── Auth Stack
         │
         ├── Onboarding
         │
         └── Main Tabs
               │
               ├── Home
               ├── F1
               ├── Fantasy
               ├── Loja
               └── Perfil
```

## Fluxo de dados

```text
                ┌───────────────┐
                │   Firebase    │
                │ Auth / Store  │
                └───────┬───────┘
                        │
                        ▼
                ┌──────────────┐
                │   Services   │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │    Screens   │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Components   │
                └──────────────┘

                   CartContext
                       │
                       ▼
                Estado do carrinho
```

---

# 🔥 Firebase

O Firebase é utilizado como infraestrutura backend do projeto.

## Serviços utilizados

* Firebase Authentication
* Cloud Firestore

## Authentication

O aplicativo utiliza autenticação por:

```text
E-mail + Senha
```

Fluxo:

```text
Cadastro
   ↓
Firebase Authentication
   ↓
UID do usuário
   ↓
Documento /users/{uid}
   ↓
Dados personalizados
```

---

# 🔐 Segurança

As informações privadas dos usuários são organizadas dentro de:

```text
/users/{userId}
```

Os dados relacionados ao usuário ficam protegidos pelas regras do Firestore.

### Regra principal

```text
request.auth.uid == userId
```

Isso significa que um usuário só pode acessar seus próprios dados.

Exemplos de estrutura:

```text
/users/{userId}
/users/{userId}/fantasy/{document}
/users/{userId}/historico/{document}
/users/{userId}/conquistas/{document}
```

> ⚠️ Dados compartilhados entre usuários, como ligas e rankings, exigem regras específicas caso sejam armazenados fora do escopo privado de cada usuário.

## Boas práticas

Nunca versionar:

* Service Account Keys
* Chaves privadas
* Tokens secretos
* Credenciais administrativas

A segurança dos dados depende principalmente das **Security Rules**, da autenticação e da arquitetura utilizada no backend.

---

# 🏁 Fonte de dados de F1

A aplicação foi projetada para consumir dados relacionados à Fórmula 1 através de fontes externas.

A API oficial da Fórmula 1 não disponibiliza uma API pública geral para desenvolvedores externos.

Por isso, foram consideradas fontes alternativas.

## Jolpica-F1

**Jolpica-F1** é a principal fonte considerada para dados históricos e estruturais.

Endpoint:

```text
https://api.jolpi.ca/ergast/f1/
```

Possíveis dados:

* Calendário
* Temporadas
* Pilotos
* Equipes
* Corridas
* Resultados
* Classificações

### Vantagens

* Gratuita
* Sem necessidade de chave para uso básico
* Estrutura baseada no antigo Ergast API
* Adequada para dados históricos

---

## OpenF1

O **OpenF1** é considerado para futuras funcionalidades de acompanhamento ao vivo.

Possíveis aplicações:

* Telemetria
* Posições
* Voltas
* Velocidade
* Dados de sessão
* Informações quase em tempo real

### Evolução planejada

```text
Jolpica-F1
   │
   ├── Calendário
   ├── Pilotos
   ├── Equipes
   ├── Resultados
   └── Classificações

OpenF1
   │
   ├── Live timing
   ├── Telemetria
   ├── Posições
   └── Dados de sessão
```

---

# 📁 Estrutura de pastas

```text
cp5---Mobile---F1Pitzone/
│
├── .claude/
│   └── configurações do assistente
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── splash/
│
├── src/
│   │
│   ├── components/
│   │   └── componentes reutilizáveis
│   │
│   ├── context/
│   │   └── CartContext
│   │
│   ├── navigation/
│   │   ├── AuthNavigator
│   │   ├── MainNavigator
│   │   └── TabNavigator
│   │
│   ├── screens/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── f1/
│   │   ├── fantasy/
│   │   ├── leagues/
│   │   ├── ranking/
│   │   ├── profile/
│   │   └── store/
│   │
│   ├── services/
│   │   ├── firebase/
│   │   └── api/
│   │
│   ├── theme/
│   │   ├── colors
│   │   ├── typography
│   │   └── spacing
│   │
│   ├── types/
│   │
│   └── utils/
│
├── App.tsx
├── index.ts
├── app.json
├── firestore.rules
├── eslint.config.js
├── tsconfig.json
├── package.json
├── AGENTS.md
├── CLAUDE.md
├── LICENSE
└── README.md
```

---

# 🚀 Como rodar

## Pré-requisitos

Antes de iniciar, tenha instalado:

* Node.js LTS
* npm
* Git
* Expo Go

Para desenvolvimento Android, também é possível utilizar:

* Android Studio
* Android Emulator

---

## 1. Clonar o repositório

```bash
git clone https://github.com/gvqsilva/cp5---Mobile---F1Pitzone.git
```

Entre na pasta:

```bash
cd cp5---Mobile---F1Pitzone
```

---

## 2. Instalar dependências

```bash
npm install
```

---

## 3. Iniciar o projeto

```bash
npx expo start
```

Depois, utilize uma das opções:

### Android

```text
a
```

### iOS

```text
i
```

### Web

```text
w
```

Ou escaneie o QR Code pelo **Expo Go**.

---

# 🔥 Configuração do Firebase

## 1. Criar o projeto

Acesse o [Firebase Console](https://console.firebase.google.com/).

Crie um novo projeto.

## 2. Ativar Authentication

No Firebase:

```text
Authentication
    ↓
Sign-in method
    ↓
E-mail / Password
    ↓
Enable
```

## 3. Criar o Firestore

Ative:

```text
Cloud Firestore
```

Configure o banco conforme o ambiente desejado.

## 4. Configurar o aplicativo

Cadastre o aplicativo no Firebase e configure as credenciais utilizadas pelo projeto dentro da camada de serviços.

Exemplo conceitual:

```text
src/
└── services/
    └── firebase/
        └── config.ts
```

## 5. Publicar regras

Instale o Firebase CLI:

```bash
npm install -g firebase-tools
```

Faça login:

```bash
firebase login
```

Publique as regras:

```bash
firebase deploy --only firestore:rules
```

---

# 🧪 Scripts

| Comando           | Descrição                                    |
| ----------------- | -------------------------------------------- |
| `npm start`       | Inicia o servidor de desenvolvimento do Expo |
| `npm run android` | Executa no Android                           |
| `npm run ios`     | Executa no iOS                               |
| `npm run web`     | Executa na Web                               |
| `npm run lint`    | Executa o ESLint                             |

Também é possível iniciar diretamente com:

```bash
npx expo start
```

---

# 🧪 Qualidade e validação

Antes de uma entrega, recomenda-se validar:

* Cadastro
* Login
* Logout
* Navegação
* Firebase
* Persistência de dados
* Fantasy
* Cálculo de pontuação
* Controle de orçamento
* Carrinho
* Checkout
* Simulação de pagamento
* Perfil
* Estados de loading
* Estados vazios
* Tratamento de erros

Também é possível executar:

```bash
npm run lint
```

---

# 📊 Fluxo de autenticação

```text
                 ┌──────────────┐
                 │   Aplicativo │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │  Onboarding  │
                 └──────┬───────┘
                        │
                ┌───────┴────────┐
                ▼                ▼
            Cadastro           Login
                │                │
                └───────┬────────┘
                        ▼
              Firebase Authentication
                        │
                        ▼
                    Usuário
                        │
                        ▼
                  Main Navigator
```

---

# 🏆 Fluxo do Fantasy

```text
             Fantasy
                │
                ▼
         Criar equipe
                │
        ┌───────┴────────┐
        ▼                ▼
     Pilotos         Construtor
        │                │
        └───────┬────────┘
                ▼
        Chefe de equipe
                │
                ▼
       Validação do orçamento
                │
                ▼
         Equipe criada
                │
                ▼
       Resultado da corrida
                │
                ▼
        Regras de pontuação
                │
                ▼
         Pontuação Fantasy
                │
                ▼
             Ranking
                │
                ▼
              Liga
```

---

# 🛒 Fluxo da loja

```text
        Loja
          │
          ▼
      Categorias
          │
          ▼
       Produtos
          │
          ▼
   Detalhes do produto
          │
          ▼
       Carrinho
          │
          ▼
        Entrega
          │
          ▼
      Pagamento
          │
          ▼
  Simulação de processamento
          │
          ▼
   Confirmação do pedido
```

---

# 📈 Status do projeto

## ✅ Implementado

### Aplicação

* [x] Identidade visual
* [x] Prototipação no Figma
* [x] Aplicação mobile
* [x] Expo + React Native
* [x] TypeScript
* [x] Navegação
* [x] Onboarding
* [x] Cadastro
* [x] Login
* [x] Firebase Authentication
* [x] Cloud Firestore
* [x] Home
* [x] Perfil
* [x] Loja
* [x] Carrinho
* [x] Context API

### 🏆 Fantasy

* [x] Criação de equipe
* [x] Seleção de pilotos
* [x] Seleção de construtor
* [x] Seleção de chefe de equipe
* [x] Controle de orçamento
* [x] Modelagem do orçamento
* [x] Modelagem da pontuação
* [x] Cálculo de pontuação
* [x] Estrutura de ranking
* [x] Estrutura de ligas

### 🛒 Loja

* [x] Catálogo
* [x] Categorias
* [x] Produtos
* [x] Detalhes do produto
* [x] Carrinho
* [x] Checkout
* [x] Dados de entrega
* [x] Simulação de pagamento
* [x] Confirmação de pedido

### 🔥 Backend

* [x] Firebase Authentication
* [x] Cloud Firestore
* [x] Regras de segurança
* [x] Persistência de dados

---

## 🚧 Em evolução

* [ ] Ranking global em tempo real
* [ ] Ligas em tempo real
* [ ] Sistema completo de conquistas
* [ ] Integração de notícias
* [ ] Sincronização avançada do Fantasy

---

## 🔮 Próximos passos

As próximas evoluções planejadas incluem:

* [ ] Acompanhamento de corrida ao vivo
* [ ] Telemetria
* [ ] Push Notifications
* [ ] Sistema de amigos
* [ ] Comentários e interações
* [ ] Histórico avançado do Fantasy
* [ ] Acompanhamento de entrega
* [ ] PitZone+
* [ ] Conteúdo exclusivo para assinantes

---

# ⭐ Visão futura — PitZone+

O **PitZone+** é uma possibilidade de evolução da plataforma para um modelo de assinatura.

Possíveis benefícios:

```text
PitZone+
│
├── 📊 Estatísticas avançadas
├── 🏎️ Dados em tempo real
├── 🔔 Alertas personalizados
├── 🏆 Recursos Fantasy exclusivos
├── 📈 Análises avançadas
├── 🎨 Personalização do perfil
└── ⭐ Conteúdo exclusivo
```

---

# 🔒 Considerações de segurança

Para uma evolução para produção, recomenda-se:

* Nunca armazenar credenciais administrativas no GitHub.
* Utilizar regras específicas do Firestore.
* Validar dados recebidos do cliente.
* Não confiar exclusivamente na validação feita no aplicativo.
* Utilizar backend ou Cloud Functions para operações sensíveis.
* Controlar permissões por usuário.
* Validar operações relacionadas ao Fantasy no servidor.
* Evitar expor informações privadas de outros usuários.

---

# 🌱 Desenvolvimento

O projeto utiliza Git para controle de versão.

Fluxo recomendado:

```bash
git checkout -b feature/nova-funcionalidade
```

Depois:

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

## Convenção de commits

Exemplos:

```text
feat: adiciona tela de ranking
fix: corrige autenticação
style: ajusta identidade visual
refactor: reorganiza serviços
docs: atualiza README
```

---

# 🎓 Evolução acadêmica

O PitZone foi desenvolvido de forma incremental durante as etapas do projeto.

## CP4 — Conceito

* Definição do problema
* Ideação
* Público-alvo
* Branding
* Proposta de valor
* User Flow
* Prototipação
* Design da experiência

## CP5 — Mobile

* Desenvolvimento da aplicação
* React Native
* Expo
* TypeScript
* Navegação
* Firebase
* Autenticação
* Firestore
* Carrinho
* Loja
* Checkout
* Simulação de pagamento
* Fantasy
* Sistema de orçamento
* Sistema de pontuação
* Estrutura de ranking
* Perfil

## Próxima evolução

A evolução do projeto está direcionada para:

* experiência social;
* criação de liga para competição;
* novas funcionalidades premium.

---

# 👥 Integrantes

| Nome                 |     RM |
| -------------------- | -----: |
| **Augusto Mendonça** | 558371 |
| **Gabriel Vasquez**  | 557056 |
| **Gustavo Oliveira** | 559163 |

---

# 🎓 Contexto acadêmico

Projeto acadêmico desenvolvido para a disciplina:

**Mobile Development & IoT — FIAP**

O PitZone foi concebido como uma solução mobile para explorar conceitos de:

* Desenvolvimento mobile
* UX/UI
* React Native
* TypeScript
* Firebase
* Cloud Firestore
* Autenticação
* APIs
* Arquitetura de aplicações
* Gamificação
* Fantasy
* Integração de serviços
* Comércio digital

---

# 📄 Licença

Este projeto é distribuído sob a licença **MIT**.

Consulte o arquivo [`LICENSE`](./LICENSE) para mais informações.

---

<div align="center">

## 🏁 PitZone

**A Fórmula 1 em um só lugar.**

### 🏎️ Acompanhe a corrida. Monte seu time. Supere seus rivais

<br>

**FIAP • Mobile Development & IoT**

</div>
