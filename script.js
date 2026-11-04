// =============================================
// 1. SEUS PROJETOS
// Para adicionar um projeto novo, basta copiar
// um dos objetos abaixo e trocar os dados.
// =============================================
const projetos = [
  {
    titulo: "Fogato, aplicativo de foco",
    descricao: "App para PC que visa ajudar pessoas com TDAH a se concentrarem em uma atividade.",
    imagem: "https://placehold.co/640x360?text=Lista+de+Tarefas",
    tecnologias: ["HTML", "CSS", "JavaScript", "Electron"],
    demo: "#",
    codigo: "#",
  },
  {
    titulo: "Clima Agora",
    descricao: "Consulta a previsão do tempo de qualquer cidade usando uma API pública.",
    imagem: "https://placehold.co/640x360?text=Clima+Agora",
    tecnologias: ["JavaScript", "API"],
    demo: "#",
    codigo: "#",
  },
  {
    titulo: "Landing Page",
    descricao: "Página de apresentação responsiva para um café fictício.",
    imagem: "https://placehold.co/640x360?text=Landing+Page",
    tecnologias: ["HTML", "CSS"],
    demo: "#",
    codigo: "#",
  },
];

// =============================================
// 2. RENDERIZAR OS CARDS
// =============================================
const listaEl = document.getElementById("lista-projetos");
const filtrosEl = document.getElementById("filtros");

function criarCard(projeto) {
  const card = document.createElement("article");
  card.className = "card revelar";

  card.innerHTML = `
    <img src="${projeto.imagem}" alt="Captura de tela do projeto ${projeto.titulo}" loading="lazy">
    <div class="card-corpo">
      <h3>${projeto.titulo}</h3>
      <p>${projeto.descricao}</p>
      <ul class="tags">
        ${projeto.tecnologias.map((tec) => `<li>${tec}</li>`).join("")}
      </ul>
      <div class="card-links">
        <a href="${projeto.demo}" target="_blank" rel="noopener">Ver demo →</a>
        <a href="${projeto.codigo}" target="_blank" rel="noopener">Código</a>
      </div>
    </div>
  `;

  return card;
}

function mostrarProjetos(filtro = "Todos") {
  listaEl.innerHTML = "";

  const filtrados =
    filtro === "Todos"
      ? projetos
      : projetos.filter((p) => p.tecnologias.includes(filtro));

  filtrados.forEach((projeto) => {
    const card = criarCard(projeto);
    listaEl.appendChild(card);
    observador.observe(card);
  });
}

// =============================================
// 3. FILTROS POR TECNOLOGIA
// Os botões são criados automaticamente a partir
// das tecnologias que aparecem nos projetos.
// =============================================
function criarFiltros() {
  const tecnologias = ["Todos", ...new Set(projetos.flatMap((p) => p.tecnologias))];

  tecnologias.forEach((tec) => {
    const botao = document.createElement("button");
    botao.className = "filtro";
    botao.textContent = tec;
    if (tec === "Todos") botao.classList.add("ativo");

    botao.addEventListener("click", () => {
      document.querySelectorAll(".filtro").forEach((b) => b.classList.remove("ativo"));
      botao.classList.add("ativo");
      mostrarProjetos(tec);
    });

    filtrosEl.appendChild(botao);
  });
}

// =============================================
// 4. ANIMAÇÃO AO ROLAR A PÁGINA
// =============================================
const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".revelar").forEach((el) => observador.observe(el));

// =============================================
// 5. TEMA CLARO / ESCURO (lembra a escolha)
// =============================================
const temaBotao = document.getElementById("tema-toggle");

function aplicarTema(tema) {
  document.documentElement.setAttribute("data-tema", tema);
  temaBotao.textContent = tema === "escuro" ? "☀️" : "🌙";
}

const temaSalvo = localStorage.getItem("tema");
const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
aplicarTema(temaSalvo || (prefereEscuro ? "escuro" : "claro"));

temaBotao.addEventListener("click", () => {
  const novoTema =
    document.documentElement.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
  aplicarTema(novoTema);
  localStorage.setItem("tema", novoTema);
});

// =============================================
// 6. ANO NO RODAPÉ
// =============================================
document.getElementById("ano").textContent = new Date().getFullYear();

// Inicia tudo
criarFiltros();
mostrarProjetos();