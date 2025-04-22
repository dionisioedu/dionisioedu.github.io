---
title: 🏟️ SportPulse – Plataforma de Dados Esportivos em Tempo Real
date: 2025-04-22
layout: project
nav-menu: false
show_tile: false
tags: [C++, API, esportes, backend, arquitetura]
---

**SportPulse** é uma aplicação de backend em C++ desenvolvida com foco em alta performance, modularidade e integração com serviços externos. O projeto centraliza, busca e expõe dados esportivos por meio de uma API REST moderna.

<img src="{% link assets/images/sportpulse_diagram.png %}" alt="Diagram"  />

[Visitar Site](https://sportpulse.today)

### 🔧 Tecnologias e Arquitetura

- **Linguagem:** C++ moderno (C++17)
- **Frameworks:** 
  - [CppRESTSDK](https://github.com/microsoft/cpprestsdk) para criação do servidor REST
  - [nlohmann/json](https://github.com/nlohmann/json) para parsing de JSON
- **Design Modular:** 
  - `LeagueService`, `SportService`, `CountryService`, `SearchService`, `LeagueForCountryService`
- **API externa:** Integração com [TheSportsDB](https://www.thesportsdb.com/)
- **Interfaces de acesso:**
  - API REST (`RestServer`)
  - Terminal interativo (`CLIInterface`)
- **Padrões adotados:** 
  - Inversão de dependência com `IApiClient`
  - Logging centralizado
  - Separação clara entre modelos, serviços e interfaces

### 📦 Funcionalidades

- Listagem de:
  - Esportes
  - Ligas
  - Países
- Buscas por:
  - **Times** (nome ou código)
  - **Jogadores** (nome ou time)
  - **Eventos** (nome, ano, ou filename)
  - **Locais/Venues**
- Agrupamento de ligas por país e esporte
- Respostas formatadas em JSON via REST

### 🧩 Modelagem de Dados

- Estruturas de dados modeladas a partir da API externa:
  - `Sport`, `League`, `Country`, `Team`, `Player`, `Event`, `Venue`, `LeagueForCountry`
- Mapeamento robusto de atributos, incluindo mídias, descrições multilíngues, relações entre entidades e metadados.

### 📡 Casos de Uso

- Base para sistemas de **placares ao vivo**
- Backend para **apps mobile** esportivos
- Geração de **dashboards esportivos customizados**
- Projetos com foco em **recomendações e análise de dados esportivos**

### 🌐 Status

Projeto em constante evolução, com arquitetura preparada para:
- Escalabilidade horizontal
- Cache de resultados
- Suporte futuro a WebSockets para **eventos em tempo real**
- Autenticação e autorização

---

Se quiser ver o código ou colaborar, entre em contato comigo pelo [X @dionisiodev](https://www.x.com/dionisiodev) ou confira mais detalhes nos repositórios do projeto: \
[SportPulse Backend](https://github.com/dionisioedu/SportPulse) \
[SportPulse Frontend](https://github.com/dionisioedu/SportPulse-UI)