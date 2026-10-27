
const articles = [
  {
    id: 1,
    title: "The race for the next Top 1",
    category: "demonlist",
    categoryLabel: "Demonlist",
    description:
      "Explore the world of Geometry Dash's hardest levels and follow the community's Demonlist rankings.",
    image: "https://autonick.github.io/diff-faces/levels/none/extremeDemon/none/none.png",
    imageAlt: "Extreme Demon difficulty face",
    imageFit: "contain",
    imageBackground: "#21151A",
    source: "Pointercrate Demonlist",
    sourceUrl: "https://pointercrate.com/demonlist/"
  },
  {
    id: 2,
    title: "Where to follow Geometry Dash updates",
    category: "updates",
    categoryLabel: "Updates",
    description:
      "Find official Geometry Dash news and announcements through the game's Steam news page.",
    image: "https://www.robtopgames.com/Images/GJ_logo_001.png",
    imageAlt: "Geometry Dash logo",
    imageFit: "contain",
    imageBackground: "#21151A",
    source: "Official Geometry Dash Steam News",
    sourceUrl: "https://store.steampowered.com/news/app/322170/"
  },
  {
    id: 3,
    title: "How to follow special event levels",
    category: "events",
    categoryLabel: "Event Levels",
    description:
      "Learn about Geometry Dash Event Levels and where to find information about these special stages.",
    image: "https://geometrydash.wiki.gg/images/9/94/EventLevel.png",
    imageAlt: "Geometry Dash Event Level icon",
    imageFit: "contain",
    imageBackground: "#21151A",
    source: "Geometry Dash Wiki — Event Level",
    sourceUrl: "https://geometrydash.wiki.gg/wiki/Event_Level"
  }
];

// DAILY CREATOR ROTATION
// Add new creators to this list to expand the cycle.
const creators = [
  {
    name: "Vortrox",
    initial: "V",
    description:
      "A Geometry Dash community creator featured in our daily rotation. Explore their videos and contributions to the game.",
    search: "Vortrox Geometry Dash"
  },
  {
    name: "EVW",
    initial: "E",
    description:
      "A familiar Geometry Dash content creator known for videos, gameplay, and sharing the game's challenges with viewers.",
    search: "EVW Geometry Dash"
  },
  {
    name: "Zoink",
    initial: "Z",
    description:
      "A high-level Geometry Dash player known for tackling some of the game's most challenging levels.",
    search: "Zoink Geometry Dash"
  }
];

// Vortrox is Day 01 on October 27, 2026 (UTC).
// The lineup advances once per UTC calendar day.
function getCreatorOfTheDay() {
  const today = new Date();
  const todayUTC = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  const startDay = Date.UTC(2026, 9, 27);
  const daysSinceStart = Math.floor(
    (todayUTC - startDay) / 86400000
  );

  const index =
    ((daysSinceStart % creators.length) + creators.length) %
    creators.length;

  return {
    creator: creators[index],
    dayNumber: index + 1
  };
}

function renderCreatorOfTheDay() {
  const nameElement = document.querySelector("#creator-name");
  const initialsElement = document.querySelector("#creator-initials");
  const descriptionElement = document.querySelector("#creator-description");
  const dayElement = document.querySelector("#creator-day-number");
  const linkElement = document.querySelector("#creator-link");

  if (
    !nameElement ||
    !initialsElement ||
    !descriptionElement ||
    !dayElement ||
    !linkElement
  ) {
    return;
  }

  const { creator, dayNumber } = getCreatorOfTheDay();

  nameElement.textContent = creator.name;
  initialsElement.textContent = creator.initial;
  descriptionElement.textContent = creator.description;
  dayElement.textContent = `DAY ${String(dayNumber).padStart(2, "0")}`;

  linkElement.href =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(creator.search);

  linkElement.setAttribute("target", "_blank");
  linkElement.setAttribute("rel", "noopener noreferrer");
}

// EXISTING NEWSROOM FEATURES

const newsGrid = document.querySelector("#news-grid");
const searchInput = document.querySelector("#search-input");
const resultsCount = document.querySelector("#results-count");
const filterButtons = document.querySelectorAll(".filter-btn");
const articleDialog = document.querySelector("#article-dialog");
const closeDialog = document.querySelector("#close-dialog");
const spotlightButton = document.querySelector("#spotlight-btn");

let activeCategory = "all";

function renderArticles() {
  if (!newsGrid) return;

  const searchTerm = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      activeCategory === "all" ||
      article.category === activeCategory;

    const searchableText = [
      article.title,
      article.description,
      article.categoryLabel
    ].join(" ").toLowerCase();

    return matchesCategory && searchableText.includes(searchTerm);
  });

  newsGrid.innerHTML = "";

  if (resultsCount) {
    resultsCount.textContent =
      `${filteredArticles.length} reference guide` +
      (filteredArticles.length === 1 ? "" : "s");
  }

  if (filteredArticles.length === 0) {
    newsGrid.innerHTML = `
      <div class="empty-state">
        <h3>No guides found</h3>
        <p>Try another search or choose a different category.</p>
      </div>
    `;
    return;
  }

  filteredArticles.forEach((article) => {
    const card = document.createElement("article");
    card.className = "news-card";

    const thumbnail = document.createElement("div");
    thumbnail.className = "news-thumbnail";
    thumbnail.style.background = article.imageBackground;

    const image = document.createElement("img");
    image.src = article.image;
    image.alt = article.imageAlt;
    image.loading = "lazy";
    image.style.objectFit = article.imageFit || "cover";

    if (article.imageFit === "contain") {
      image.style.padding = "16px";
    }

    image.onerror = () => {
      image.style.display = "none";
    };

    thumbnail.appendChild(image);

    const content = document.createElement("div");
    content.className = "news-content";

    const categoryTag = document.createElement("span");
    categoryTag.className = "category-tag";
    categoryTag.textContent = article.categoryLabel;

    const title = document.createElement("h3");
    title.textContent = article.title;

    const description = document.createElement("p");
    description.textContent = article.description;

    const readMore = document.createElement("button");
    readMore.className = "read-more";
    readMore.type = "button";
    readMore.textContent = "Read guide →";
    readMore.addEventListener("click", () => openArticle(article));

    content.append(categoryTag, title, description, readMore);
    card.append(thumbnail, content);
    newsGrid.appendChild(card);
  });
}

function openArticle(article) {
  if (!articleDialog) return;

  const category = articleDialog.querySelector("#article-category");
  const title = articleDialog.querySelector("#article-title");
  const date = articleDialog.querySelector("#article-date");
  const body = articleDialog.querySelector("#article-body");
  const sourceLink = articleDialog.querySelector("#article-source");

  if (category) {
    category.textContent = article.categoryLabel;
  }

  if (title) {
    title.textContent = article.title;
  }

  if (date) {
    date.textContent = "REFERENCE GUIDE";
  }

  if (body) {
    body.replaceChildren();

    const description = document.createElement("p");
    description.textContent = article.description;

    const note = document.createElement("p");
    note.textContent =
      "This is a reference guide, not a live news report. Visit the original source for the latest information.";

    body.append(description, note);
  }

  if (sourceLink) {
    sourceLink.href = article.sourceUrl;
    sourceLink.textContent = "Visit " + article.source + " ↗";
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
  }

  if (typeof articleDialog.showModal === "function") {
    if (!articleDialog.open) {
      articleDialog.showModal();
    }
  } else {
    articleDialog.setAttribute("open", "");
  }
}

if (searchInput) {
  searchInput.addEventListener("input", renderArticles);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    activeCategory = button.dataset.filter || "all";
    renderArticles();
  });
});

if (closeDialog && articleDialog) {
  closeDialog.addEventListener("click", () => {
    if (typeof articleDialog.close === "function") {
      articleDialog.close();
    } else {
      articleDialog.removeAttribute("open");
    }
  });
}

if (articleDialog) {
  articleDialog.addEventListener("click", (event) => {
    if (event.target === articleDialog) {
      if (typeof articleDialog.close === "function") {
        articleDialog.close();
      } else {
        articleDialog.removeAttribute("open");
      }
    }
  });
}

if (spotlightButton) {
  spotlightButton.addEventListener("click", () => {
    const latest = document.querySelector("#latest");

    if (latest) {
      latest.scrollIntoView({ behavior: "smooth" });
    }
  });
}

renderCreatorOfTheDay();
renderArticles();
