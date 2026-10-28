const products = [
  { id: "tuc-tuc", name: "Tuc Tuc Elétrico", category: "triciclo", page: 2, price: 12990, image: "assets/wm-page-02.webp", tag: "TRÊS RODAS", detail: "O catálogo apresenta este modelo com motor 1000 W, bateria 60 V / 20 Ah e velocidade máxima de até 32 km/h. O próprio material informa que a autonomia varia conforme o uso." },
  { id: "wm3", name: "E-Bike WM3", category: "bike", page: 3, price: 5490, image: "assets/wm-page-03.webp", tag: "BIKE ELÉTRICA" },
  { id: "e60", name: "E60", category: "scooter", page: 4, price: 9900, image: "assets/wm-page-04.webp", tag: "SCOOTER" },
  { id: "wm1", name: "WM1", category: "scooter", page: 5, price: 4990, image: "assets/wm-page-05.webp", tag: "SCOOTER" },
  { id: "e50", name: "E50", category: "scooter", page: 6, price: 8890, image: "assets/wm-page-06.webp", tag: "SCOOTER" },
  { id: "e30", name: "E30", category: "scooter", page: 7, price: 9190, image: "assets/wm-page-07.webp", tag: "SCOOTER" },
  { id: "x13", name: "X13 Londres / Carbono", category: "triciclo", page: 8, price: 8490, image: "assets/wm-page-08.webp", tag: "TRÊS RODAS" },
  { id: "701", name: "701", category: "scooter", page: 9, price: 9990, image: "assets/wm-page-09.webp", tag: "SCOOTER" },
  { id: "x20", name: "X20", category: "scooter", page: 10, price: 9190, image: "assets/wm-page-10.webp", tag: "SCOOTER" },
  { id: "z3", name: "Z3", category: "scooter", page: 11, price: 5990, image: "assets/wm-page-11.webp", tag: "SCOOTER" },
  { id: "2002", name: "2002", category: "scooter", page: 12, price: 5990, image: "assets/wm-page-12.webp", tag: "SCOOTER" },
  { id: "r8-plus", name: "R8 Plus", category: "bike", page: 13, price: 6890, image: "assets/wm-page-13.webp", tag: "BIKE ELÉTRICA" },
  { id: "gp70", name: "GP70", category: "bike", page: 14, price: 3190, image: "assets/wm-page-14.webp", tag: "BIKE ELÉTRICA" },
  { id: "1994", name: "1994", category: "bike", page: 15, price: 5590, image: "assets/wm-page-15.webp", tag: "BIKE ELÉTRICA" },
  { id: "m7", name: "M7", category: "scooter", page: 16, price: 3990, image: "assets/wm-page-16.webp", tag: "SCOOTER" },
  { id: "m4", name: "M4", category: "scooter", page: 17, price: 3190, image: "assets/wm-page-17.webp", tag: "SCOOTER" },
  { id: "ks202", name: "KS202", category: "patinete", page: 18, price: 1490, image: "assets/wm-page-18.webp", tag: "PATINETE" },
  { id: "k91", name: "K91", category: "infantil", page: 19, price: 1390, image: "assets/wm-page-19.webp", tag: "INFANTIL" },
  { id: "drift-infantil", name: "Drift Infantil", category: "infantil", page: 20, price: 1290, image: "assets/wm-page-20.webp", tag: "INFANTIL" },
  { id: "eletrica-walk", name: "Elétrica WALK · pág. 21", category: "moto", page: 21, price: 4190, image: "assets/wm-page-21.webp", tag: "MOTO ELÉTRICA" },
  { id: "triciclo-wm", name: "Triciclo elétrico", category: "triciclo", page: 22, price: 8990, image: "assets/wm-page-22.webp", tag: "TRÊS RODAS" },
  { id: "t1", name: "T1", category: "scooter", page: 23, price: 8990, image: "assets/wm-page-23.webp", tag: "SCOOTER" },
  { id: "t2", name: "T2 Triciclo", category: "triciclo", page: 24, price: 8990, image: "assets/wm-page-24.webp", tag: "TRÊS RODAS" },
  { id: "t3", name: "T3", category: "triciclo", page: 25, price: 8990, image: "assets/wm-page-25.webp", tag: "TRÊS RODAS" },
  { id: "cross", name: "Cross", category: "bike", page: 26, price: 7990, image: "assets/wm-page-26.webp", tag: "BIKE ELÉTRICA" },
];

const categoryLabels = {
  scooter: "Scooter elétrica",
  bike: "Bike elétrica",
  moto: "Moto elétrica",
  triciclo: "Triciclo elétrico",
  patinete: "Patinete elétrico",
  infantil: "Linha infantil",
};
const grid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const compareTray = document.querySelector("#compareTray");
const comparePanel = document.querySelector("#comparePanel");
const compareTable = document.querySelector("#compareTable");
const compareWhatsApp = document.querySelector("#compareWhatsApp");
const compareCount = document.querySelector("#compareCount");
const dialog = document.querySelector("#productDialog");
const toast = document.querySelector("#toast");
let activeCategory = "all";
let selected = new Set();
let toastTimer;
let favorites;
try {
  favorites = new Set(JSON.parse(localStorage.getItem("walkmachine-favorites") || "[]"));
} catch {
  favorites = new Set();
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function matchesCategory(product) {
  return activeCategory === "all" || product.category === activeCategory;
}

function visibleProducts() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = products.filter((product) => {
    const text = `${product.name} ${product.tag} ${categoryLabels[product.category]}`.toLocaleLowerCase("pt-BR");
    return matchesCategory(product) && text.includes(term);
  });
  if (sortSelect.value === "price-up") filtered.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "price-down") filtered.sort((a, b) => b.price - a.price);
  return filtered;
}

function renderProducts() {
  const shown = visibleProducts();
  grid.innerHTML = shown.map((product, index) => {
    const favorite = favorites.has(product.id);
    const chosen = selected.has(product.id);
    const position = String(index + 1).padStart(2, "0");
    return `<article class="product-card">
      <div class="product-image-wrap">
        <span class="product-index">${position} <i>·</i> ${product.tag}</span>
        <button class="favorite-button ${favorite ? "is-favorite" : ""}" type="button" data-favorite="${product.id}" aria-label="${favorite ? "Remover" : "Adicionar"} ${product.name} ${favorite ? "dos" : "aos"} favoritos" aria-pressed="${favorite}">${favorite ? "♥" : "♡"}</button>
        <img class="product-image" src="${product.image}" alt="${product.name}, imagem recortada da página ${product.page} do catálogo recebido" loading="lazy" decoding="async">
        <span class="source-stamp">MATERIAL DA LOJA</span>
      </div>
      <div class="product-card-info">
        <div class="product-card-top"><span>${categoryLabels[product.category]}</span><span>PDF · P. ${String(product.page).padStart(2, "0")}</span></div>
        <h3>${product.name}</h3>
        <div class="product-price"><span>Valor mostrado no PDF</span><strong>${money(product.price)}</strong></div>
        <div class="product-card-actions">
          <button class="detail-button" type="button" data-detail="${product.id}">Ver detalhes</button>
          <button class="compare-button ${chosen ? "is-selected" : ""}" type="button" data-compare="${product.id}" aria-label="${chosen ? "Remover" : "Adicionar"} ${product.name} ${chosen ? "da" : "à"} comparação" aria-pressed="${chosen}">${chosen ? "✓" : "+"}</button>
        </div>
      </div>
    </article>`;
  }).join("");
  emptyState.hidden = shown.length > 0;
  resultCount.textContent = `${shown.length} ${shown.length === 1 ? "modelo" : "modelos"}`;
  renderCompareTray();
}

function renderCompareTray() {
  compareTray.hidden = selected.size === 0;
  compareCount.textContent = `${selected.size} ${selected.size === 1 ? "modelo selecionado" : "modelos selecionados"}`;
}

function renderComparison() {
  const chosen = products.filter((product) => selected.has(product.id));
  if (!chosen.length) return;
  compareTable.innerHTML = `<table><caption class="sr-only">Modelos selecionados e valores mostrados no PDF</caption><thead><tr><th scope="col">Modelo</th><th scope="col">Categoria</th><th scope="col">Valor no PDF</th></tr></thead><tbody>${chosen.map((product) => `<tr><th scope="row">${product.name}</th><td>${categoryLabels[product.category]}</td><td>${money(product.price)}</td></tr>`).join("")}</tbody></table>`;
  const modelList = chosen.map((product) => product.name).join(", ");
  const message = encodeURIComponent(`Oi! Estou olhando o conceito de catálogo da Walk Machine e queria confirmar a versão, o preço atual e a disponibilidade destes modelos: ${modelList}.`);
  compareWhatsApp.href = `https://wa.me/5511982372996?text=${message}`;
  comparePanel.hidden = false;
  comparePanel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  document.querySelector("#closeCompare").focus({ preventScroll: true });
}

function openDetails(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  document.querySelector("#dialogImage").src = product.image;
  document.querySelector("#dialogImage").alt = `${product.name}, imagem extraída do catálogo recebido`;
  document.querySelector("#dialogCategory").textContent = `${categoryLabels[product.category]} · PÁGINA ${String(product.page).padStart(2, "0")}`;
  document.querySelector("#dialogTitle").textContent = product.name;
  document.querySelector("#dialogPrice").textContent = money(product.price);
  document.querySelector("#dialogDescription").textContent = product.detail || "Modelo apresentado no catálogo compartilhado pela Walk Machine. Consulte a equipe para conferir a versão e os detalhes atuais.";
  document.querySelector("#dialogPage").textContent = `Valor impresso na página ${product.page} do PDF recebido · sujeito a confirmação.`;
  const message = encodeURIComponent(`Oi! Vi o modelo ${product.name} no conceito de catálogo e queria confirmar a versão, o preço atual e a disponibilidade.`);
  document.querySelector("#dialogWhatsApp").href = `https://wa.me/5511982372996?text=${message}`;
  dialog.showModal();
}

grid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const compareButton = event.target.closest("[data-compare]");
  const detailButton = event.target.closest("[data-detail]");
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite;
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    try { localStorage.setItem("walkmachine-favorites", JSON.stringify([...favorites])); } catch { /* Funciona sem persistência nesta sessão. */ }
    renderProducts();
    showToast(favorites.has(id) ? "Modelo salvo nos favoritos." : "Modelo removido dos favoritos.");
  }
  if (compareButton) {
    const id = compareButton.dataset.compare;
    if (!selected.has(id) && selected.size >= 3) {
      showToast("Escolha até três modelos por vez.");
      return;
    }
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    renderProducts();
  }
  if (detailButton) openDetails(detailButton.dataset.detail);
});

document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.filter;
  document.querySelectorAll(".filter-button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-selected", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
}));

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

function setTheme(theme, announce = false) {
  const validThemes = new Set(["garage", "city", "editorial"]);
  if (!validThemes.has(theme)) theme = "garage";
  document.body.dataset.theme = theme;
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll(".theme-button").forEach((item) => {
    const active = item.dataset.theme === theme;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  if (announce) {
    const label = document.querySelector(`.theme-button[data-theme="${theme}"]`).textContent.trim();
    showToast(`Direção visual “${label}” aplicada.`);
  }
}
document.querySelectorAll(".theme-button").forEach((button) => button.addEventListener("click", () => {
  setTheme(button.dataset.theme, true);
}));

document.querySelector("#compareButton").addEventListener("click", renderComparison);
document.querySelector("#clearCompare").addEventListener("click", () => {
  selected.clear();
  comparePanel.hidden = true;
  renderProducts();
});
document.querySelector("#closeCompare").addEventListener("click", () => { comparePanel.hidden = true; });
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

setTheme(new URLSearchParams(window.location.search).get("theme") || "garage");
renderProducts();
