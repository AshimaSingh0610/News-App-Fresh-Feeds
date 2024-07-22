
const API_KEY = "e204e78697934ca594d4506451a48031";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
    fetchNews("Technology");
    fetchRecentNews(); // Fetch recent news for ticker
});

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
    newsDesc.innerHTML = `${article.description.slice(0, 150)}...`;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

async function fetchRecentNews() {
    const res = await fetch(`${url}latest&apiKey=${API_KEY}`);
    const data = await res.json();
    updateNewsTicker(data.articles);
}

function updateNewsTicker(articles) {
    const newsTicker = document.getElementById("newsTicker");
    newsTicker.innerHTML = ""; // Clear previous items

    let currentIndex = 0;

    function showNextNewsItem() {
        if (currentIndex >= articles.length) {
            currentIndex = 0;
        }

        const article = articles[currentIndex];
        if (!article.title) return;

        newsTicker.innerHTML = `<span class="news-ticker-item">${article.title} - ${article.source.name}</span>`;

        currentIndex++;

        setTimeout(showNextNewsItem, 5000); // Show each news item for 5 seconds
    }

    showNextNewsItem();
}
