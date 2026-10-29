
const listaPersonagens = document.getElementById("lista-personagens");
const campoBusca = document.getElementById("campo-busca");
const filtroStatus = document.getElementById("filtro-status");
const mensagemResultados = document.getElementById("mensagem-resultados");
const botaoCarregarMais = document.getElementById("btn-carregar-mais");

let personagens = [];
let proximaPagina = "https://rickandmortyapi.com/api/character";
let carregando = false;

function buscarPersonagens() {
    if (!proximaPagina || carregando) {
        return;
    }

    carregando = true;
    botaoCarregarMais.disabled = true;
    botaoCarregarMais.textContent = "Carregando...";
    mensagemResultados.textContent = "Carregando personagens...";

    fetch(proximaPagina)
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error("Não foi possível buscar os personagens.");
            }

            return resposta.json();
        })
        .then(function (dados) {
            personagens = personagens.concat(dados.results);
            proximaPagina = dados.info.next;

            filtrarPersonagens();
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            mensagemResultados.textContent =
                "Não foi possível carregar os personagens. Tente novamente.";
        })
        .finally(function () {
            carregando = false;

            if (proximaPagina) {
                botaoCarregarMais.disabled = false;
                botaoCarregarMais.textContent = "Carregar mais personagens";
            } else {
                botaoCarregarMais.textContent = "Todos os personagens foram carregados";
                botaoCarregarMais.disabled = true;
            }
        });
}

function exibirPersonagens(lista) {
    listaPersonagens.replaceChildren();

    mensagemResultados.textContent =
        lista.length + (lista.length === 1
            ? " personagem encontrado."
            : " personagens encontrados.");

    lista.forEach(function (personagem) {
        const card = document.createElement("article");
        const imagem = document.createElement("img");
        const nome = document.createElement("h3");
        const especie = document.createElement("p");
        const status = document.createElement("p");

        card.classList.add("card-personagem");

        imagem.src = personagem.image;
        imagem.alt = "Imagem de " + personagem.name;
        imagem.loading = "lazy";

        imagem.addEventListener("error", function () {
    imagem.alt = "Imagem indisponível para " + personagem.name;
    imagem.removeAttribute("src");
    });

        nome.textContent = personagem.name;
        especie.textContent = "Espécie: " + personagem.species;
        status.textContent = "Status: " + traduzirStatus(personagem.status);

        status.classList.add("status-personagem");
        status.classList.add("status-" + personagem.status.toLowerCase());

        card.appendChild(imagem);
        card.appendChild(nome);
        card.appendChild(especie);
        card.appendChild(status);

        listaPersonagens.appendChild(card);
    });

    if (lista.length === 0) {
        mensagemResultados.textContent =
            "Nenhum personagem encontrado. Tente outra pesquisa.";
    }
}

function traduzirStatus(status) {
    if (status === "Alive") {
        return "Vivo";
    }

    if (status === "Dead") {
        return "Morto";
    }

    return "Desconhecido";
}

function filtrarPersonagens() {
    const textoBusca = campoBusca.value.toLowerCase().trim();
    const statusSelecionado = filtroStatus.value;

    const personagensFiltrados = personagens.filter(function (personagem) {
        const nomeCorresponde = personagem.name
            .toLowerCase()
            .includes(textoBusca);

        const statusCorresponde =
            statusSelecionado === "todos" ||
            personagem.status === statusSelecionado;

        return nomeCorresponde && statusCorresponde;
    });

    exibirPersonagens(personagensFiltrados);
}

campoBusca.addEventListener("input", filtrarPersonagens);
filtroStatus.addEventListener("change", filtrarPersonagens);
botaoCarregarMais.addEventListener("click", buscarPersonagens);

buscarPersonagens();

