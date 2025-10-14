// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("favoritesGallery");
  const countSpan = document.getElementById("favoritesCount");

  // Get liked art IDs from localStorage
  function getLikedArtworks() {
    return JSON.parse(localStorage.getItem("likedArtworks") || "[]");
  }

  // Fetch details for a single artwork by ID
  async function fetchArtworkById(id) {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks/${id}`);
    const data = await response.json();
    return data.data;
  }

  // Display favorite artworks
  async function displayFavorites() {
    const likedIds = getLikedArtworks();
    countSpan.textContent = likedIds.length;

    gallery.innerHTML = "";

    if (likedIds.length === 0) {
      gallery.innerHTML = `<div class="col-12 text-center text-secondary py-5">No favorites yet. Like some art on the Home page!</div>`;
      return;
    }

    // Fetch all favorite artworks in parallel
    const artworks = await Promise.all(likedIds.map(fetchArtworkById));

    artworks.forEach(art => {
      const imgUrl = art.image_id
        ? `https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`
        : "https://via.placeholder.com/300x300.png?text=No+Image";

      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";

      card.innerHTML = `
        <div class="card shadow-sm h-100 art-card favorite-card" style="cursor:pointer;">
          <img src="${imgUrl}" class="card-img-top" alt="${art.title}">
          <div class="card-body">
            <h5 class="card-title">${art.title}</h5>
            <p class="card-text text-muted">${art.artist_title || "Unknown Artist"}</p>
          </div>
        </div>
      `;

      // Clicking the card can go to details page (expand later)
      card.querySelector('.favorite-card').addEventListener('click', () => {
        // Example: window.location.href = `art.html?id=${art.id}`;
        alert(`View details for: ${art.title}`);
      });

      gallery.appendChild(card);
    });
  }

  displayFavorites();
});