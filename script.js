// Elements and Variables
const html = document.getElementById("htmlPage");
const checkbox = document.getElementById("checkbox");
const articlesList = document.getElementById("articles-list");
const mostPopularContent = document.getElementById("most-popular-content");
let articles = [];

const idToImageMap = {
    1: "https://www.luxcafeclub.com/cdn/shop/articles/240916-coffee-caffeine-heart-health-kh-d4d5cb_1100x.jpg?v=1726678632",
    2: "https://thejournal.com/-/media/EDU/CampusTechnology/2024/07/20240719aigroup.jpg",
    3: "https://images.squarespace-cdn.com/content/v1/5b338c6bf93fd40cc613354d/1555081593022-3B1H96BW3WP9LAJY7GK6/create-a-community-mural.jpg",
    4: "https://daryo.uz/static/2024/08/world-economic-outlook-growth-projections-july-2024-real-gdp-growth-map.png",
    5: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCblbIm8NHegOUdPiEkf162bo5l5tVjVpplw&s",
    6: "https://devdiscourse.blob.core.windows.net/devnews/27_10_2024_19_25_56_6169737.jpg",
    7: "https://static.wixstatic.com/media/11062b_47f82c6f766c4e05b07874cab2d40062~mv2.jpeg/v1/fill/w_1000,h_597,al_c,q_85,usm_0.66_1.00_0.01/11062b_47f82c6f766c4e05b07874cab2d40062~mv2.jpeg",
    8: "https://b2259389.smushcdn.com/2259389/wp-content/uploads/2023/10/Garage-Guard-Blog-Thumbnails-9.png?lossy=1&strip=1&webp=1",
    9: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbOsOpjG2EVjYr3ZyMxEHf4f2o-cV-7uTzg&s",
    10: "https://www.wfla.com/wp-content/uploads/sites/71/2023/05/GettyImages-1152192651.jpg?w=900"
};

// Initialize theme based on saved preference
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme') || "light";
    applyTheme(savedTheme);
    checkbox.checked = savedTheme === "dark";

    // Theme toggle listener
    checkbox.addEventListener("change", () => {
        const newTheme = checkbox.checked ? "dark" : "light";
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
});

// Apply theme globally
function applyTheme(theme) {
    if (theme === "dark") {
        html.classList.add("dark-theme");
        html.setAttribute("data-bs-theme", "dark");
    } else {
        html.classList.remove("dark-theme");
        html.setAttribute("data-bs-theme", "light");
    }
    applyThemeToModalsAndDynamicContent(theme);
}

// Apply theme to modals or dynamically loaded content
function applyThemeToModalsAndDynamicContent(theme) {
    const modal = document.getElementById("articleModal");
    if (modal) {
        modal.classList.toggle("dark-theme", theme === "dark");
    }
}

// Fetch Articles from JSON
fetch("Articles.json")
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        articles = data.articles;
        displayArticles(articles);
        displayMostPopularArticle();
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));

// Display articles
function displayArticles(articles) {
    articlesList.innerHTML = "";
    articles.forEach((article, index) => {
        const readingTime = Math.ceil(article.wordCount / 200);
        const articleImage = idToImageMap[article.id];

        const articleCard = `
            <div id="article-${index}" class="col-lg-3 col-md-4 col-sm-6 mb-4 article-card" onclick="openArticle(${index})">
                <div class="bg-image hover-overlay shadow-1-strong ripple rounded-5 mb-4" data-mdb-ripple-color="light">
                    <img src="${articleImage}" class="img-fluid" alt="${article.title}" />
                    <a href="#!">
                        <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
                    </a>
                </div>
                
                <div class="col-6">
                    <a href="" class="text-danger">
                        <i class="fas fa-chart-pie"></i>
                        ${article.category}
                    </a>
                </div>

                <div class="row mb-3">
                    <div class="col-6">
                        <h5>${article.title}</h5>
                    </div>
                    <div class="col-6 text-end">
                        <u>${article.date}</u>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-6">
                        <small class="text-muted">Estimated reading time: ${readingTime} min</small>
                    </div>
                    <div class="col-6 text-end view-count">
                        <small class="text-muted">${article.views} views</small>
                    </div>
                </div>
                
                <a href="#!" class="text-dark">
                    <p id="preview-${index}">${article.content.substring(0, 100)}...</p>
                    <p id="full-${index}" style="display:none">${article.content}</p>
                </a>
                <button onclick="openArticle(${index}); event.stopPropagation();">Read More</button>
                <hr />
            </div>
        `;
        articlesList.innerHTML += articleCard;
    });
}

// Open an article and increment views
function openArticle(index) {
    const article = articles[index];
    article.views += 1;

    const articleCardViewCount = document.querySelector(`#article-${index} .view-count`);
    if (articleCardViewCount) {
        articleCardViewCount.textContent = `${article.views} views`;
    }

    displayMostPopularArticle();

    document.getElementById('articleModalLabel').innerText = article.title;
    document.getElementById('articleModalImage').src = idToImageMap[article.id];
    document.getElementById('articleModalContent').innerText = article.content;
    document.getElementById('articleModalDetails').innerText = `
        Published on ${new Date(article.date).toLocaleDateString()} - ${article.views} views - ${calculateReadingTime(article.wordCount)} min read
    `;

    const modal = new bootstrap.Modal(document.getElementById('articleModal'));
    modal.show();
}

// Calculate reading time
function calculateReadingTime(wordCount) {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
}

function displayMostPopularArticle() {
    const mostPopularArticle = articles.reduce((max, article) => article.views > max.views ? article : max, articles[0]);
    const articleImage = idToImageMap[mostPopularArticle.id];

    const mostPopularImage = document.getElementById("mostPopularImage");
    mostPopularImage.src = articleImage;
    mostPopularImage.alt = mostPopularArticle.title;
    mostPopularImage.style.width = "100%";
    mostPopularImage.style.maxHeight = "400px";
    mostPopularImage.style.objectFit = "cover";
    mostPopularImage.style.borderRadius = "10px";
    mostPopularImage.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";

    document.getElementById("mostPopularTitle").innerText = mostPopularArticle.title;
    document.getElementById("mostPopularContent").innerText = mostPopularArticle.content.substring(0, 150) + "...";
    document.getElementById("mostPopularDetails").innerText = `
        Published on ${new Date(mostPopularArticle.date).toLocaleDateString()} - ${mostPopularArticle.views} views - ${calculateReadingTime(mostPopularArticle.wordCount)} min read
    `;
    document.getElementById("mostPopularImage").dataset.index = articles.indexOf(mostPopularArticle);
}

function openMostPopularArticle() {
    const index = document.getElementById("mostPopularImage").dataset.index;
    openArticle(index);
}

// Sorting function
function sortArticles(criteria) {
    if (criteria === 'date') {
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (criteria === 'popularity') {
        articles.sort((a, b) => b.views - a.views);
    }
    displayArticles(articles);
    displayMostPopularArticle();
}
