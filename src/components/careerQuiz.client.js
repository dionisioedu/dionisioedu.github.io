/**
 * careerQuiz.client.js
 *
 * Interactive MCQ career-finder quiz. Data-driven, bilingual (pt/en).
 * Exported as an object with a `mount(root)` entry point for Astro.
 */

const areas = {
  frontend: {
    id: "frontend",
    icon: "🎨",
    pt: {
      title: "Desenvolvimento Web Frontend",
      desc: "Você se destaca criando interfaces que encantam. Tem olho para design, usabilidade e adora ver o resultado do seu trabalho ganhar vida no navegador.",
      tags: ["React", "CSS", "UX", "TypeScript", "Next.js", "Acessibilidade"],
    },
    en: {
      title: "Frontend Web Development",
      desc: "You shine when creating interfaces that delight users. You have an eye for design, usability, and love seeing your work come to life in the browser.",
      tags: ["React", "CSS", "UX", "TypeScript", "Next.js", "Accessibility"],
    },
  },
  backend: {
    id: "backend",
    icon: "⚙️",
    pt: {
      title: "Desenvolvimento Web Backend",
      desc: "Você pensa em sistemas. Gosta de arquitetar APIs, modelar bancos de dados e resolver problemas complexos de lógica que ninguém vê — mas todos dependem.",
      tags: ["APIs", "Banco de Dados", "Node.js", "Go", "Microsserviços", "Arquitetura"],
    },
    en: {
      title: "Backend Web Development",
      desc: "You think in systems. You enjoy architecting APIs, modeling databases, and solving complex logic problems that nobody sees — but everyone depends on.",
      tags: ["APIs", "Databases", "Node.js", "Go", "Microservices", "Architecture"],
    },
  },
  devops: {
    id: "devops",
    icon: "🚀",
    pt: {
      title: "DevOps / SRE / Cloud",
      desc: "Você gosta de manter tudo funcionando. Infraestrutura, pipelines, monitoramento — você é a pessoa que garante que o código chegue em produção e fique lá.",
      tags: ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Observabilidade"],
    },
    en: {
      title: "DevOps / SRE / Cloud",
      desc: "You like keeping everything running. Infrastructure, pipelines, monitoring — you're the person who ensures code reaches production and stays there.",
      tags: ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Observability"],
    },
  },
  data: {
    id: "data",
    icon: "📊",
    pt: {
      title: "Ciência de Dados / IA / ML",
      desc: "Você encontra padrões onde outros veem caos. Adora explorar dados, criar modelos preditivos e transformar informação bruta em decisões estratégicas.",
      tags: ["Python", "SQL", "Machine Learning", "Pandas", "Estatística", "LLMs"],
    },
    en: {
      title: "Data Science / AI / ML",
      desc: "You find patterns where others see chaos. You love exploring data, building predictive models, and turning raw information into strategic decisions.",
      tags: ["Python", "SQL", "Machine Learning", "Pandas", "Statistics", "LLMs"],
    },
  },
  mobile: {
    id: "mobile",
    icon: "📱",
    pt: {
      title: "Desenvolvimento Mobile",
      desc: "Você quer construir apps que as pessoas carregam no bolso. Gosta da ideia de impactar milhões de usuários diretamente pelo smartphone.",
      tags: ["React Native", "Flutter", "Swift", "Kotlin", "App Store", "Push Notifications"],
    },
    en: {
      title: "Mobile Development",
      desc: "You want to build apps that people carry in their pockets. You love the idea of impacting millions of users directly through their smartphones.",
      tags: ["React Native", "Flutter", "Swift", "Kotlin", "App Store", "Push Notifications"],
    },
  },
  security: {
    id: "security",
    icon: "🔐",
    pt: {
      title: "Segurança da Informação",
      desc: "Você pensa como atacante para defender melhor. Adora encontrar vulnerabilidades, entender ameaças e proteger sistemas antes que alguém os explore.",
      tags: ["Pentest", "Criptografia", "Red Team", "OWASP", "Blue Team", "CTF"],
    },
    en: {
      title: "Cybersecurity",
      desc: "You think like an attacker to defend better. You love finding vulnerabilities, understanding threats, and protecting systems before someone exploits them.",
      tags: ["Pentest", "Cryptography", "Red Team", "OWASP", "Blue Team", "CTF"],
    },
  },
  gamedev: {
    id: "gamedev",
    icon: "🎮",
    pt: {
      title: "Desenvolvimento de Jogos",
      desc: "Você quer criar mundos. Mistura programação com arte, física e narrativa para construir experiências interativas que divertem e emocionam.",
      tags: ["Unity", "Unreal", "C#", "C++", "3D", "Game Design"],
    },
    en: {
      title: "Game Development",
      desc: "You want to create worlds. You mix programming with art, physics, and storytelling to build interactive experiences that entertain and move people.",
      tags: ["Unity", "Unreal", "C#", "C++", "3D", "Game Design"],
    },
  },
  embedded: {
    id: "embedded",
    icon: "🔧",
    pt: {
      title: "Sistemas Embarcados / IoT",
      desc: "Você gosta de programar perto do hardware. Sensores, microcontroladores e dispositivos físicos — você faz código que interage com o mundo real.",
      tags: ["C", "C++", "Arduino", "ARM", "RTOS", "PCB"],
    },
    en: {
      title: "Embedded Systems / IoT",
      desc: "You like programming close to the hardware. Sensors, microcontrollers, and physical devices — you write code that interacts with the real world.",
      tags: ["C", "C++", "Arduino", "ARM", "RTOS", "PCB"],
    },
  },
  qa: {
    id: "qa",
    icon: "🧪",
    pt: {
      title: "QA / Testes de Software",
      desc: "Você tem mente investigativa. Adora quebrar coisas de propósito para garantir que elas funcionem. Qualidade é sua obsessão.",
      tags: ["Automação", "Selenium", "Cypress", "Testes", "BDD", "Performance"],
    },
    en: {
      title: "QA / Software Testing",
      desc: "You have an investigative mind. You love breaking things on purpose to make sure they work. Quality is your obsession.",
      tags: ["Automation", "Selenium", "Cypress", "Testing", "BDD", "Performance"],
    },
  },
  product: {
    id: "product",
    icon: "💡",
    pt: {
      title: "Produto / Gestão Técnica",
      desc: "Você conecta tecnologia e negócio. Entende o que usuários precisam, prioriza funcionalidades e lidera times para entregar valor real.",
      tags: ["Product Management", "OKRs", "Roadmap", "Stakeholders", "Discovery", "Métricas"],
    },
    en: {
      title: "Product / Technical Management",
      desc: "You bridge technology and business. You understand what users need, prioritize features, and lead teams to deliver real value.",
      tags: ["Product Management", "OKRs", "Roadmap", "Stakeholders", "Discovery", "Metrics"],
    },
  },
};

// 20 questions, each option maps to a career area
const questions = {
  pt: [
    {
      q: "O que mais te motiva ao construir algo?",
      opts: [
        { t: "Ver o design ganhar vida na tela", a: "frontend" },
        { t: "Resolver um problema lógico complexo por trás da cena", a: "backend" },
        { t: "Garantir que o sistema aguente milhares de acessos sem cair", a: "devops" },
        { t: "Descobrir padrões ocultos nos dados gerados", a: "data" },
      ],
    },
    {
      q: "Qual tipo de bug você mais gostaria de corrigir?",
      opts: [
        { t: "Um layout quebrado em telas menores", a: "frontend" },
        { t: "Uma condição de corrida corrompendo dados no banco", a: "backend" },
        { t: "Um vazamento de memória derrubando servidores em produção", a: "devops" },
        { t: "Um modelo de ML com overfitting nos dados de treino", a: "data" },
      ],
    },
    {
      q: "Em um projeto novo, o que você prefere fazer primeiro?",
      opts: [
        { t: "Prototipar a interface e testar com usuários", a: "product" },
        { t: "Investigar vulnerabilidades conhecidas da stack escolhida", a: "security" },
        { t: "Configurar o pipeline de CI/CD e os ambientes", a: "devops" },
        { t: "Modelar o banco de dados e definir contratos de API", a: "backend" },
      ],
    },
    {
      q: "Como você prefere aprender uma tecnologia nova?",
      opts: [
        { t: "Construindo um app visual e iterando rápido", a: "frontend" },
        { t: "Criando um jogo simples para explorar a engine", a: "gamedev" },
        { t: "Escrevendo testes automatizados para cobrir cada funcionalidade", a: "qa" },
        { t: "Conectando sensores e fazendo um LED piscar", a: "embedded" },
      ],
    },
    {
      q: "Qual projeto paralelo mais te atrai?",
      opts: [
        { t: "Um e-commerce com carrinho, pagamento e dashboard", a: "backend" },
        { t: "Um app de realidade aumentada para iOS e Android", a: "mobile" },
        { t: "Um honeypot que registra tentativas de invasão", a: "security" },
        { t: "Um modelo que prevê o preço de ações com dados históricos", a: "data" },
      ],
    },
    {
      q: "O que você considera mais gratificante no dia a dia?",
      opts: [
        { t: "Ver métricas de uptime em 99.99% no dashboard", a: "devops" },
        { t: "Receber feedback de usuários dizendo que o app está fluido", a: "mobile" },
        { t: "Automatizar um processo manual que ninguém aguentava mais", a: "qa" },
        { t: "Convencer stakeholders com dados e pesquisa, não com opinião", a: "product" },
      ],
    },
    {
      q: "Qual destes problemas te tira o sono (no bom sentido)?",
      opts: [
        { t: "Fazer uma animação de 60fps rodar liso em qualquer dispositivo", a: "frontend" },
        { t: "Otimizar uma query que demora 3 segundos para 50ms", a: "backend" },
        { t: "Descobrir como um atacante conseguiu burlar a autenticação", a: "security" },
        { t: "Fazer um drone autônomo desviar de obstáculos em tempo real", a: "embedded" },
      ],
    },
    {
      q: "Qual stack você acha mais interessante?",
      opts: [
        { t: "React + Tailwind + Framer Motion", a: "frontend" },
        { t: "Go + PostgreSQL + Redis", a: "backend" },
        { t: "Kubernetes + Terraform + Prometheus", a: "devops" },
        { t: "Python + Jupyter + PyTorch", a: "data" },
      ],
    },
    {
      q: "Em uma discussão de time, qual papel você naturalmente assume?",
      opts: [
        { t: "Questionar se estamos construindo a coisa certa para o usuário", a: "product" },
        { t: "Perguntar como vamos testar isso antes de entregar", a: "qa" },
        { t: "Lembrar que precisamos de logs e alertas para isso", a: "devops" },
        { t: "Sugerir uma engine pronta em vez de reinventar a roda", a: "gamedev" },
      ],
    },
    {
      q: "Qual tipo de conferência você teria mais interesse em assistir?",
      opts: [
        { t: "WWDC ou Google I/O — novidades de plataformas mobile", a: "mobile" },
        { t: "DEF CON ou Black Hat — segurança ofensiva e defensiva", a: "security" },
        { t: "NeurIPS ou KDD — pesquisa em IA e ciência de dados", a: "data" },
        { t: "Embedded World — sistemas embarcados e hardware", a: "embedded" },
      ],
    },
    {
      q: "Se você tivesse que explicar seu trabalho para uma criança de 8 anos, o que diria?",
      opts: [
        { t: "Eu faço os botões e telas que você vê nos sites e apps", a: "frontend" },
        { t: "Eu crio as regras que fazem o jogo funcionar por dentro", a: "gamedev" },
        { t: "Eu testo tudo muitas vezes pra ter certeza que nada quebra", a: "qa" },
        { t: "Eu cuido para que os servidores não durmam no meio do dia", a: "devops" },
      ],
    },
    {
      q: "O que é mais importante para você em um projeto?",
      opts: [
        { t: "Que a experiência do usuário seja impecável", a: "mobile" },
        { t: "Que o código seja limpo, testado e sustentável", a: "qa" },
        { t: "Que os dados estejam seguros e em conformidade", a: "security" },
        { t: "Que o projeto entregue valor mensurável para o negócio", a: "product" },
      ],
    },
    {
      q: "Qual ferramenta você usaria para resolver um problema agora?",
      opts: [
        { t: "Figma ou Sketch — desenhar a solução visualmente", a: "frontend" },
        { t: "Excel ou Pandas — analisar os dados primeiro", a: "data" },
        { t: "Wireshark ou Burp Suite — inspecionar o tráfego de rede", a: "security" },
        { t: "Osciloscópio — medir o sinal direto no hardware", a: "embedded" },
      ],
    },
    {
      q: "O que você mais admira em um sistema bem construído?",
      opts: [
        { t: "A fluidez e responsividade da interface", a: "mobile" },
        { t: "A arquitetura limpa que permite escalar horizontalmente", a: "backend" },
        { t: "A engine de física que simula o mundo real perfeitamente", a: "gamedev" },
        { t: "A visão de produto que resolve uma dor real do mercado", a: "product" },
      ],
    },
    {
      q: "Qual destas tarefas você faria com mais prazer?",
      opts: [
        { t: "Criar um pipeline que faz deploy em 5 ambientes ao mesmo tempo", a: "devops" },
        { t: "Escrever um scraper que coleta dados de 100 sites diariamente", a: "data" },
        { t: "Montar uma bancada de testes com Arduino e sensores reais", a: "embedded" },
        { t: "Fazer code review buscando edge cases e possíveis falhas", a: "qa" },
      ],
    },
    {
      q: "Qual é a sua maior força como profissional?",
      opts: [
        { t: "Empatia com o usuário e visão de produto", a: "product" },
        { t: "Pensamento crítico e capacidade de antecipar falhas", a: "security" },
        { t: "Criatividade para construir experiências imersivas", a: "gamedev" },
        { t: "Disciplina para escrever testes e documentação", a: "qa" },
      ],
    },
    {
      q: "Se você fosse mentor de um júnior, qual seria o primeiro conselho?",
      opts: [
        { t: "Aprenda a debugar com o DevTools do navegador", a: "frontend" },
        { t: "Entenda bem HTTP, REST e bancos de dados relacionais", a: "backend" },
        { t: "Aprenda Linux, linha de comando e shell script", a: "devops" },
        { t: "Construa algo simples com um microcontrolador barato", a: "embedded" },
      ],
    },
    {
      q: "Qual métrica mais importa para você?",
      opts: [
        { t: "Tempo de carregamento da página (LCP, FID)", a: "frontend" },
        { t: "Latência p99 das chamadas de API", a: "backend" },
        { t: "MTTR — tempo médio para recuperação após incidente", a: "devops" },
        { t: "Acurácia e recall do modelo em produção", a: "data" },
      ],
    },
    {
      q: "Em qual cenário você se sente mais realizado?",
      opts: [
        { t: "Lançar um app na Play Store e ver as primeiras 1000 instalações", a: "mobile" },
        { t: "Encontrar e reportar uma vulnerabilidade crítica antes do deploy", a: "security" },
        { t: "Ver um robô que você programou se movendo fisicamente", a: "embedded" },
        { t: "Apresentar um roadmap que convenceu a diretoria a investir", a: "product" },
      ],
    },
    {
      q: "O que você gostaria de estar fazendo daqui a 5 anos?",
      opts: [
        { t: "Liderando o design system de uma grande plataforma", a: "frontend" },
        { t: "Arquitetando sistemas que processam milhões de transações por minuto", a: "backend" },
        { t: "Desenvolvendo uma engine de jogo usada por milhares de devs", a: "gamedev" },
        { t: "Criando modelos de IA que resolvem problemas reais de saúde", a: "data" },
      ],
    },
  ],
  en: [
    {
      q: "What motivates you most when building something?",
      opts: [
        { t: "Seeing the design come to life on screen", a: "frontend" },
        { t: "Solving a complex logic problem behind the scenes", a: "backend" },
        { t: "Ensuring the system handles thousands of requests without crashing", a: "devops" },
        { t: "Discovering hidden patterns in the data it generates", a: "data" },
      ],
    },
    {
      q: "Which type of bug would you enjoy fixing most?",
      opts: [
        { t: "A layout that breaks on smaller screens", a: "frontend" },
        { t: "A race condition corrupting data in the database", a: "backend" },
        { t: "A memory leak taking down production servers", a: "devops" },
        { t: "An ML model overfitting the training data", a: "data" },
      ],
    },
    {
      q: "In a new project, what do you prefer to do first?",
      opts: [
        { t: "Prototype the interface and test with users", a: "product" },
        { t: "Investigate known vulnerabilities in the chosen stack", a: "security" },
        { t: "Set up the CI/CD pipeline and environments", a: "devops" },
        { t: "Model the database and define API contracts", a: "backend" },
      ],
    },
    {
      q: "How do you prefer learning a new technology?",
      opts: [
        { t: "Building a visual app and iterating fast", a: "frontend" },
        { t: "Creating a simple game to explore the engine", a: "gamedev" },
        { t: "Writing automated tests to cover every feature", a: "qa" },
        { t: "Connecting sensors and making an LED blink", a: "embedded" },
      ],
    },
    {
      q: "Which side project appeals most to you?",
      opts: [
        { t: "An e-commerce with cart, payment, and dashboard", a: "backend" },
        { t: "An augmented reality app for iOS and Android", a: "mobile" },
        { t: "A honeypot that logs intrusion attempts", a: "security" },
        { t: "A model that predicts stock prices with historical data", a: "data" },
      ],
    },
    {
      q: "What do you find most rewarding day-to-day?",
      opts: [
        { t: "Seeing 99.99% uptime metrics on the dashboard", a: "devops" },
        { t: "Getting user feedback saying the app feels smooth", a: "mobile" },
        { t: "Automating a manual process everyone hated", a: "qa" },
        { t: "Convincing stakeholders with data and research, not opinion", a: "product" },
      ],
    },
    {
      q: "Which of these problems keeps you up at night (in a good way)?",
      opts: [
        { t: "Making a 60fps animation run smoothly on any device", a: "frontend" },
        { t: "Optimizing a query from 3 seconds down to 50ms", a: "backend" },
        { t: "Figuring out how an attacker bypassed authentication", a: "security" },
        { t: "Making an autonomous drone avoid obstacles in real time", a: "embedded" },
      ],
    },
    {
      q: "Which stack do you find most interesting?",
      opts: [
        { t: "React + Tailwind + Framer Motion", a: "frontend" },
        { t: "Go + PostgreSQL + Redis", a: "backend" },
        { t: "Kubernetes + Terraform + Prometheus", a: "devops" },
        { t: "Python + Jupyter + PyTorch", a: "data" },
      ],
    },
    {
      q: "In a team discussion, which role do you naturally take?",
      opts: [
        { t: "Questioning whether we're building the right thing for the user", a: "product" },
        { t: "Asking how we'll test this before shipping", a: "qa" },
        { t: "Reminding everyone we need logging and alerting for this", a: "devops" },
        { t: "Suggesting a ready-made engine instead of reinventing the wheel", a: "gamedev" },
      ],
    },
    {
      q: "Which type of conference would you most want to attend?",
      opts: [
        { t: "WWDC or Google I/O — mobile platform news", a: "mobile" },
        { t: "DEF CON or Black Hat — offensive and defensive security", a: "security" },
        { t: "NeurIPS or KDD — AI and data science research", a: "data" },
        { t: "Embedded World — embedded systems and hardware", a: "embedded" },
      ],
    },
    {
      q: "If you had to explain your job to an 8-year-old, what would you say?",
      opts: [
        { t: "I make the buttons and screens you see on websites and apps", a: "frontend" },
        { t: "I create the rules that make the game work inside", a: "gamedev" },
        { t: "I test everything many times to make sure nothing breaks", a: "qa" },
        { t: "I make sure the servers don't fall asleep in the middle of the day", a: "devops" },
      ],
    },
    {
      q: "What matters most to you in a project?",
      opts: [
        { t: "That the user experience is flawless", a: "mobile" },
        { t: "That the code is clean, tested, and maintainable", a: "qa" },
        { t: "That data is secure and compliant", a: "security" },
        { t: "That the project delivers measurable business value", a: "product" },
      ],
    },
    {
      q: "Which tool would you reach for to solve a problem right now?",
      opts: [
        { t: "Figma or Sketch — design the solution visually", a: "frontend" },
        { t: "Excel or Pandas — analyze the data first", a: "data" },
        { t: "Wireshark or Burp Suite — inspect network traffic", a: "security" },
        { t: "Oscilloscope — measure the signal directly on the hardware", a: "embedded" },
      ],
    },
    {
      q: "What do you admire most in a well-built system?",
      opts: [
        { t: "The fluidity and responsiveness of the interface", a: "mobile" },
        { t: "The clean architecture that allows horizontal scaling", a: "backend" },
        { t: "The physics engine that perfectly simulates the real world", a: "gamedev" },
        { t: "The product vision that solves a real market pain point", a: "product" },
      ],
    },
    {
      q: "Which of these tasks would you do with the most pleasure?",
      opts: [
        { t: "Create a pipeline that deploys to 5 environments simultaneously", a: "devops" },
        { t: "Write a scraper that collects data from 100 sites daily", a: "data" },
        { t: "Set up a test bench with Arduino and real sensors", a: "embedded" },
        { t: "Do a code review hunting for edge cases and potential failures", a: "qa" },
      ],
    },
    {
      q: "What is your greatest strength as a professional?",
      opts: [
        { t: "User empathy and product vision", a: "product" },
        { t: "Critical thinking and ability to anticipate failures", a: "security" },
        { t: "Creativity to build immersive experiences", a: "gamedev" },
        { t: "Discipline to write tests and documentation", a: "qa" },
      ],
    },
    {
      q: "If you were mentoring a junior, what would be your first piece of advice?",
      opts: [
        { t: "Learn to debug with the browser DevTools", a: "frontend" },
        { t: "Understand HTTP, REST, and relational databases well", a: "backend" },
        { t: "Learn Linux, command line, and shell scripting", a: "devops" },
        { t: "Build something simple with a cheap microcontroller", a: "embedded" },
      ],
    },
    {
      q: "Which metric matters most to you?",
      opts: [
        { t: "Page load time (LCP, FID)", a: "frontend" },
        { t: "API p99 latency", a: "backend" },
        { t: "MTTR — mean time to recovery after an incident", a: "devops" },
        { t: "Model accuracy and recall in production", a: "data" },
      ],
    },
    {
      q: "In which scenario do you feel most fulfilled?",
      opts: [
        { t: "Launching an app on the Play Store and seeing the first 1000 installs", a: "mobile" },
        { t: "Finding and reporting a critical vulnerability before deploy", a: "security" },
        { t: "Watching a robot you programmed move physically", a: "embedded" },
        { t: "Presenting a roadmap that convinced leadership to invest", a: "product" },
      ],
    },
    {
      q: "What would you like to be doing 5 years from now?",
      opts: [
        { t: "Leading the design system of a major platform", a: "frontend" },
        { t: "Architecting systems that process millions of transactions per minute", a: "backend" },
        { t: "Building a game engine used by thousands of developers", a: "gamedev" },
        { t: "Creating AI models that solve real health problems", a: "data" },
      ],
    },
  ],
};

// i18n labels
const i18n = {
  pt: {
    introTitle: "Descubra sua área na tecnologia",
    introText:
      "Responda 20 perguntas rápidas e descubra qual área de tecnologia mais combina com seu perfil. Leva menos de 5 minutos.",
    startBtn: "Começar teste",
    resultsTitle: "Seu perfil tech",
    resultsSub: "As áreas que mais combinam com você:",
    restartBtn: "Refazer teste",
    of: "de",
    match: "match",
  },
  en: {
    introTitle: "Discover your tech career path",
    introText:
      "Answer 20 quick questions and find out which tech area fits you best. Takes less than 5 minutes.",
    startBtn: "Start quiz",
    resultsTitle: "Your tech profile",
    resultsSub: "The areas that match you best:",
    restartBtn: "Retake quiz",
    of: "of",
    match: "match",
  },
};

export function mount(root) {
  const lang = root.dataset.lang || "pt";
  const labels = i18n[lang];
  const qs = questions[lang];

  // Resolve elements
  const intro = root.querySelector("[data-quiz-intro]");
  const questionScreen = root.querySelector("[data-quiz-question]");
  const resultsScreen = root.querySelector("[data-quiz-results]");
  const progressBar = root.querySelector("[data-quiz-progress-bar]");
  const progressText = root.querySelector("[data-quiz-progress-text]");
  const questionText = root.querySelector("[data-quiz-question-text]");
  const optionsContainer = root.querySelector("[data-quiz-options]");
  const resultsList = root.querySelector("[data-quiz-results-list]");
  const startBtn = root.querySelector("[data-quiz-start]");
  const restartBtn = root.querySelector("[data-quiz-restart]");

  // State
  let currentIdx = 0;
  let scores = {};

  function resetScores() {
    scores = {};
    for (const area of Object.keys(areas)) {
      scores[area] = 0;
    }
  }

  function showScreen(screen) {
    intro.hidden = true;
    questionScreen.hidden = true;
    resultsScreen.hidden = true;
    screen.hidden = false;
  }

  function renderQuestion() {
    const q = qs[currentIdx];
    questionText.textContent = q.q;
    progressText.textContent = `${currentIdx + 1} ${labels.of} ${qs.length}`;
    progressBar.style.setProperty("--pct", `${((currentIdx + 1) / qs.length) * 100}%`);

    optionsContainer.innerHTML = "";
    q.opts.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.textContent = opt.t;
      btn.addEventListener("click", () => selectOption(opt.a));
      optionsContainer.appendChild(btn);
    });
  }

  function selectOption(area) {
    scores[area] = (scores[area] || 0) + 1;
    currentIdx++;

    if (currentIdx >= qs.length) {
      showResults();
    } else {
      renderQuestion();
    }
  }

  function showResults() {
    // Sort areas by score descending
    const ranked = Object.entries(scores)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const maxScore = ranked[0]?.[1] || 1;

    resultsList.innerHTML = "";
    ranked.forEach(([areaId, score], idx) => {
      const area = areas[areaId];
      const locale = area[lang];
      const pct = Math.round((score / 20) * 100);

      const card = document.createElement("div");
      card.className = `quiz-result-card${idx === 0 ? " quiz-result-card--top" : ""}`;

      card.innerHTML = `
        <div class="quiz-result-header">
          <span class="quiz-result-icon">${area.icon}</span>
          <span class="quiz-result-title">${locale.title}</span>
          <span class="quiz-result-score">${pct}% ${labels.match}</span>
        </div>
        <p class="quiz-result-desc">${locale.desc}</p>
        <div class="quiz-result-tags">
          ${locale.tags.map((t) => `<span class="quiz-tag">${t}</span>`).join("")}
        </div>
      `;

      resultsList.appendChild(card);
    });

    showScreen(resultsScreen);
  }

  function startQuiz() {
    resetScores();
    currentIdx = 0;
    renderQuestion();
    showScreen(questionScreen);
  }

  // Progress bar width update via CSS custom property
  const style = document.createElement("style");
  style.textContent = `
    [data-quiz-progress-bar]::after { width: var(--pct, 0%) !important; }
  `;
  root.appendChild(style);

  // Update i18n labels on the static HTML
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (labels[key]) el.textContent = labels[key];
  });

  // Events
  startBtn.addEventListener("click", startQuiz);
  restartBtn.addEventListener("click", startQuiz);
}
