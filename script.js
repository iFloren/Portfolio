// =============================================
// 1. SEUS PROJETOS
// Para adicionar um projeto novo, basta copiar
// um dos objetos abaixo e trocar os dados.
// =============================================
const projetos = [
  {
    titulo: "Fogato, aplicativo de foco",
    descricao: "App para PC que visa ajudar pessoas com TDAH a se concentrarem em uma atividade.",
    imagem: "assets/fogato-logo.jpg",
    imagemLogo: true, // true = imagem pequena/logo, aparece inteira sem cortar
    tecnologias: ["HTML", "CSS", "JavaScript", "Electron"],
    demo: "demos/Demo Fogato.mp4",
    codigo: "https://github.com/iFloren/Fogato",
  },
  
];

// =============================================
// 2. RENDERIZAR OS CARDS
// =============================================
const listaEl = document.getElementById("lista-projetos");
const filtrosEl = document.getElementById("filtros");

// Se o link da demo for um arquivo de vídeo, ele abre num player na própria página
function ehVideo(caminho) {
  return /\.(mp4|webm|ogg|mov)$/i.test(caminho);
}

function criarCard(projeto) {
  const card = document.createElement("article");
  card.className = "card revelar";

  card.innerHTML = `
    <img src="${projeto.imagem}"${projeto.imagemLogo ? ' class="logo-projeto"' : ""} alt="Captura de tela do projeto ${projeto.titulo}" loading="lazy">
    <div class="card-corpo">
      <h3>${projeto.titulo}</h3>
      <p>${projeto.descricao}</p>
      <ul class="tags">
        ${projeto.tecnologias.map((tec) => `<li>${tec}</li>`).join("")}
      </ul>
      <div class="card-links">
        ${
          ehVideo(projeto.demo)
            ? `<a href="${projeto.demo}" class="abrir-video" data-video="${projeto.demo}" data-titulo="${projeto.titulo}">Ver demo ▶</a>`
            : `<a href="${projeto.demo}" target="_blank" rel="noopener">Ver demo →</a>`
        }
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
// 6. PLAYER DE VÍDEO DAS DEMOS
// =============================================
const modalVideo = document.getElementById("modal-video");
const playerVideo = document.getElementById("player-video");
const tituloVideo = document.getElementById("modal-video-titulo");

listaEl.addEventListener("click", (evento) => {
  const link = evento.target.closest(".abrir-video");
  if (!link) return;

  evento.preventDefault();
  tituloVideo.textContent = link.dataset.titulo;
  playerVideo.src = link.dataset.video;
  modalVideo.showModal();
  playerVideo.play().catch(() => {});
});

function fecharVideo() {
  playerVideo.pause();
  playerVideo.removeAttribute("src");
  playerVideo.load();
}

document.getElementById("fechar-video").addEventListener("click", () => modalVideo.close());

// Fecha ao clicar fora do vídeo
modalVideo.addEventListener("click", (evento) => {
  if (evento.target === modalVideo) modalVideo.close();
});

// Para o vídeo sempre que o modal fechar (botão, Esc ou clique fora)
modalVideo.addEventListener("close", fecharVideo);

// =============================================
// 7. ANO NO RODAPÉ
// =============================================
document.getElementById("ano").textContent = new Date().getFullYear();

// Inicia tudo
criarFiltros();
mostrarProjetos();