/* aptitude-quiz.js */

/* ========= CONFIGURAÇÃO ========= */
const AREA_INFO = {
  backend:   { name:'Backend Engineering',    desc:'Você se destaca em lógica, arquitetura de sistemas e APIs robustas.', career:'Carreiras: Eng. Backend, Eng. de Dados, SRE.' },
  frontend:  { name:'Frontend / UI',          desc:'Você transforma ideias em interfaces responsivas e elegantes.',       career:'Carreiras: Frontend Dev, Web Designer, Mobile Dev.' },
  ux:        { name:'UX / Product Design',    desc:'Empatia com usuários e visão de produto são seu forte.',              career:'Carreiras: UX Designer, Product Designer, Pesquisador(a) de UX.' },
  qa:        { name:'QA & Test Automation',   desc:'Você garante que tudo funcione impecavelmente.',                      career:'Carreiras: QA Engineer, SDET, Test Automation.' },
  cybersec:  { name:'Cybersecurity',          desc:'Você ama análise de riscos e defesa digital.',                        career:'Carreiras: Analista de Segurança, Pentester, Blue/Red Team.' },
  devops:    { name:'DevOps / Cloud',         desc:'Você adora automação e escalar sistemas.',                            career:'Carreiras: DevOps Engineer, Cloud Architect, SRE.' },
  data:      { name:'Data Science & AI/ML',   desc:'Busca insights em dados e curte modelos inteligentes.',               career:'Carreiras: Data Scientist, ML Engineer, BI Analyst.' },
  commercial:{ name:'Tech Sales / Pre-Sales', desc:'Sua comunicação e visão de negócio brilham.',                         career:'Carreiras: Sales Engineer, Customer Success, Evangelist.' }
};

const QUESTIONS = [
  { q:'Você prefere…', a:[['backend','Resolver problemas de lógica'],['frontend','Criar interfaces bonitas'],['ux','Entender o usuário'],['cybersec','Procurar falhas']]},
  { q:'Em um projeto empolga mais…', a:[['backend','Otimizar performance'],['frontend','Animar protótipos'],['devops','Automatizar deploy'],['data','Analisar dados']]},
  { q:'Tarefas repetitivas são…', a:[['qa','Essenciais para qualidade'],['backend','Importantes p/ APIs'],['frontend','Ok pelo visual'],['cybersec','Parte da defesa']]},
  { q:'No hackathon você…', a:[['data','Faz dashboard'],['ux','Cuida do onboarding'],['devops','Monta Kubernetes'],['commercial','Faz o pitch']]},
  { q:'Elogio favorito:', a:[['backend','App mais rápido'],['frontend','Design premiado'],['ux','Uso sem tutorial'],['cybersec','Zero vulnerabilidades']]},
  { q:'Hobby ideal:', a:[['cybersec','CTFs online'],['frontend','Pintar/desenhar'],['data','Planilhas de tudo'],['backend','LEGO complexo']]},
  { q:'No time você gosta de…', a:[['commercial','Falar com cliente'],['qa','Garantir qualidade'],['devops','Facilitar infra'],['ux','Planejar roadmap']]},
  { q:'O que mais incomoda?', a:[['qa','Bug em produção'],['frontend','Interface desalinhada'],['cybersec','Falha de segurança'],['data','Decisão sem dados']]},
  { q:'Filme/série que inspira', a:[['cybersec','Mr. Robot'],['backend','O Jogo da Imitação'],['commercial','Fome de Poder'],['ux','Her']]},
  { q:'Em apresentações prefere…', a:[['data','Métricas e gráficos'],['frontend','Mockups animados'],['qa','Testes automatizados'],['devops','Arquitetura na nuvem']]},
  { q:'1h extra no dia para…', a:[['backend','Aprender linguagem'],['frontend','Testar lib visual'],['data','Analisar dataset'],['cybersec','Simular ataque']]},
  { q:'Sucesso é medido em…', a:[['backend','Performance'],['ux','Satisfação do usuário'],['qa','Cobertura de testes'],['commercial','Receita gerada']]}
];

/* ========= ESTADO ========= */
const state = { user:{name:'',age:'',email:''}, answers:[], idx:0 };

/* ========= HELPERS ========= */
const $  = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const quiz = document.getElementById('quiz');
const clear = () => { quiz.innerHTML = ''; };

function flip(el){
  if (!el) return;                     // segurança extra
  el.classList.add('flip-enter');
  setTimeout(()=>el.classList.add('flip-active'),10);
  setTimeout(()=>el.classList.remove('flip-enter','flip-active'),700);
}

/* ========= RENDER ========= */
function intro(){
  clear();
  quiz.innerHTML = `
    <div class="quiz-card">
      <h1 class="quiz-title">Encontre sua área em Tecnologia</h1>
      <p  class="quiz-subtitle">Responda algumas perguntas para receber uma indicação personalizada.</p>

      <label class="quiz-label" for="name">Nome</label>
      <input id="name"  class="quiz-input" placeholder="Seu nome" />

      <label class="quiz-label" for="age">Idade</label>
      <input id="age"   class="quiz-input" placeholder="Sua idade" type="number" />

      <label class="quiz-label" for="email">Email</label>
      <input id="email" class="quiz-input" placeholder="Seu email" type="email" />

      <button id="start" class="btn btn-primary">Começar</button>
    </div>`;
  flip(quiz.firstElementChild);

  $('#start').onclick = () => {
    const n=$('#name').value.trim(), a=$('#age').value.trim(), e=$('#email').value.trim();
    if(!n||!a||!e) return alert('Preencha todos os campos');
    state.user={name:n,age:a,email:e}; state.answers=[]; state.idx=0; question();
  };
}

function question(){
  clear();
  const {q,a} = QUESTIONS[state.idx];
  const buttons = a.map(([v,l])=>`<button data-v="${v}" class="btn btn-option">${l}</button>`).join('');
  quiz.innerHTML = `
    <div class="quiz-card">
      <h2 class="quiz-question">Pergunta ${state.idx+1} / ${QUESTIONS.length}</h2>
      <p  class="quiz-question">${q}</p>
      ${buttons}
    </div>`;
  flip(quiz.firstElementChild);

  $$('.btn-option').forEach(b=>b.onclick=()=>{
    state.answers.push(b.dataset.v);
    state.idx++;
    state.idx<QUESTIONS.length?question():result();
  });
}

function result(){
  clear();
  const counts = state.answers.reduce((m,v)=>(m[v]=(m[v]||0)+1,m),{});
  const key = Object.keys(counts).reduce((a,b)=>counts[a]>=counts[b]?a:b);
  const area = AREA_INFO[key];

  quiz.innerHTML = `
    <div class="quiz-card" style="text-align:center">
      <h2 class="quiz-title">${state.user.name}, sua área ideal é:</h2>
      <p  class="quiz-result-main">${area.name}</p>
      <p  class="quiz-subtitle">${area.desc}</p>
      <p  class="quiz-subtitle" style="margin-bottom:1.5rem">${area.career}</p>
      <button id="restart" class="btn btn-secondary">Refazer</button>
    </div>`;
  flip(quiz.firstElementChild);

  $('#restart').onclick = intro;
  save({ ...state.user, suggestion:key, answers:state.answers });
}

/* ========= Persistência (placeholder) ========= */
async function save(data){
  console.log('Pronto para enviar', data);
  // await fetch('/api/quiz', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
}

/* ========= BOOT ========= */
document.addEventListener('DOMContentLoaded', intro);
