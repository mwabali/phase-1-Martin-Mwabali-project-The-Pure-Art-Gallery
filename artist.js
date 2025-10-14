// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const artistsList = document.getElementById("artistsList");
  const artistGallery = document.getElementById("artistGallery");
  const backBtn = document.getElementById("backToArtists");

  // Get liked art IDs from localStorage
  function getLikedArtworks() {
    return JSON.parse(localStorage.getItem("likedArtworks") || "[]");
  }
  function setLikedArtworks(ids) {
    localStorage.setItem("likedArtworks", JSON.stringify(ids));
  }

  // Fetch artists (limit to 50 for performance)
  async function fetchArtists() {
    const response = await fetch("https://api.artic.edu/api/v1/artists?limit=50");
    const data = await response.json();
    return data.data.filter(artist => artist.title); // Only artists with a name
  }

  // Fetch artworks by artist name
  async function fetchArtworksByArtist(artistName) {
    // The API supports filtering by artist_title
    const response = await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(artistName)}&limit=30`);
    const data = await response.json();
    // The search API returns results in data.data
    return data.data || [];
  }

  // Render the grid of artist "cards"
  function displayArtists(artists) {
    artistsList.innerHTML = "";
    artistGallery.style.display = "none";
    backBtn.style.display = "none";
    artists.forEach(artist => {
      const col = document.createElement("div");
      col.className = "col-md-3 mb-4";
      col.innerHTML = `
        <div class="card artist-card text-center h-100" style="cursor:pointer;">
          <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <span class="artist-icon mb-2">👤</span>
            <h5 class="card-title">${artist.title}</h5>
          </div>
        </div>
      `;
      col.querySelector('.artist-card').addEventListener('click', () => {
        showArtistGallery(artist.title);
      });
      artistsList.appendChild(col);
    });
  }

  // Render artworks for a selected artist
  async function showArtistGallery(artistName) {
    artistsList.innerHTML = "";
    artistGallery.style.display = "";
    backBtn.style.display = "";
    artistGallery.innerHTML = `<div class="col-12 text-center text-info py-5">Loading art by <b>${artistName}</b>...</div>`;
    const artworks = await fetchArtworksByArtist(artistName);
    artistGallery.innerHTML = "";
    const likedIds = getLikedArtworks();

    if (artworks.length === 0) {
      artistGallery.innerHTML = `<div class="col-12 text-center text-secondary py-5">No artworks found for this artist.</div>`;
      return;
    }

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

      artistGallery.appendChild(card);
    });
  }

  // Back button logic
  backBtn.addEventListener('click', async () => {
    artistGallery.style.display = "none";
    backBtn.style.display = "none";
    const artists = await fetchArtists();
    displayArtists(artists);
  });

  // Initial load: show all artists
  fetchArtists().then(displayArtists);
});