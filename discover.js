// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("discoverGallery");

  // Get liked art IDs from localStorage
  function getLikedArtworks() {
    return JSON.parse(localStorage.getItem("likedArtworks") || "[]");
  }

  // Save liked art IDs to localStorage
  function setLikedArtworks(ids) {
    localStorage.setItem("likedArtworks", JSON.stringify(ids));
  }

  // Shuffle an array (Fisher-Yates)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Fetch a large set of artworks, then pick 51 at random
  async function fetchRandomArtworks() {
    const response = await fetch("https://api.artic.edu/api/v1/artworks?limit=100");
    const data = await response.json();
    const allArt = data.data;
    return shuffle(allArt).slice(0, 51);
  }

  // Display artworks in the gallery grid
  function displayArtworks(artworks) {
    gallery.innerHTML = "";
    const likedIds = getLikedArtworks();

    artworks.forEach(art => {
      const imgUrl = art.image_id
        ? `https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`
        : "https://via.placeholder.com/300x300.png?text=No+Image";

      const isLiked = likedIds.includes(art.id);

      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";

      card.innerHTML = `
        <div class="card shadow-sm h-100 art-card">
          <img src="${imgUrl}" class="card-img-top" alt="${art.title}">
          <div class="card-body">
            <h5 class="card-title">${art.title}</h5>
            <p class="card-text text-muted">${art.artist_title || "Unknown Artist"}</p>
            <button class="btn btn-like btn-circle like-btn${isLiked ? ' liked' : ''}" aria-label="Like">
              <svg class="heart-icon" width="28" height="28" viewBox="0 0 24 24" fill="${isLiked ? 'red' : 'none'}" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 21s-6.7-5.6-9.3-8.2A5.5 5.5 0 0 1 7.5 3.5c1.7 0 3.4 1.1 4.5 2.6C13.1 4.6 14.8 3.5 16.5 3.5A5.5 5.5 0 0 1 21.3 12.8C18.7 15.4 12 21 12 21z"/>
              </svg>
            </button>
            <button class="btn view-btn ms-2">View More</button>
          </div>
        </div>
      `;

      // Like button logic
      const likeBtn = card.querySelector(".like-btn");
      const heartIcon = card.querySelector(".heart-icon");
      likeBtn.addEventListener("click", () => {
        let liked = getLikedArtworks();
        if (liked.includes(art.id)) {
          liked = liked.filter(id => id !== art.id);
          likeBtn.classList.remove("liked");
          heartIcon.setAttribute("fill", "none");
        } else {
          liked.push(art.id);
          likeBtn.classList.add("liked");
          heartIcon.setAttribute("fill", "red");
          likeBtn.classList.add("pop");
          setTimeout(() => likeBtn.classList.remove("pop"), 300);
        }
        setLikedArtworks(liked);
      });

      // View More button (expand later)
      const viewBtn = card.querySelector(".view-btn");
      viewBtn.addEventListener("click", () => {
        alert(`View details for: ${art.title}`);
        // You can redirect to art.html with query params here
      });

      gallery.appendChild(card);
    });
  }

  // Fetch and display artworks when the page loads
  fetchRandomArtworks().then(displayArtworks);
});