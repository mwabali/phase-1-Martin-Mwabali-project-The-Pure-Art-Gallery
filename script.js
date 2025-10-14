// Wait for the DOM to be fully loaded before running any code
document.addEventListener("DOMContentLoaded", () => {
  // Get the gallery container where art cards will be displayed
  const gallery = document.getElementById("homeGallery");

  // Get liked art IDs from localStorage, or empty array
  function getLikedArtworks() {
    return JSON.parse(localStorage.getItem("likedArtworks") || "[]");
  }

  // Save liked art IDs to localStorage
  function setLikedArtworks(ids) {
    localStorage.setItem("likedArtworks", JSON.stringify(ids));
  }

  // Fetch 51 artworks from the Art Institute of Chicago API
  async function fetchArtworks() {
    const response = await fetch("https://api.artic.edu/api/v1/artworks?limit=51");
    const data = await response.json();
    return data.data;
  }

  // Display artworks in the gallery grid
  function displayArtworks(artworks) {
    gallery.innerHTML = "";
    const likedIds = getLikedArtworks();

    artworks.forEach(art => {
      // Build the image URL or use a placeholder if missing
      const imgUrl = art.image_id
        ? `https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`
        : "https://via.placeholder.com/300x300.png?text=No+Image";

      // Check if this artwork is liked
      const isLiked = likedIds.includes(art.id);

      // Create a Bootstrap column for the card
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";

      // Set the card's inner HTML with SVG heart icon
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
            <button class="btn btn-outline-light btn-circle ms-2 view-btn">View More</button>
          </div>
        </div>
      `;

      // Like button logic
      const likeBtn = card.querySelector(".like-btn");
      const heartIcon = card.querySelector(".heart-icon");
      likeBtn.addEventListener("click", () => {
        let liked = getLikedArtworks();
        if (liked.includes(art.id)) {
          // Unlike
          liked = liked.filter(id => id !== art.id);
          likeBtn.classList.remove("liked");
          heartIcon.setAttribute("fill", "none");
        } else {
          // Like
          liked.push(art.id);
          likeBtn.classList.add("liked");
          heartIcon.setAttribute("fill", "red");
          // Pop animation
          likeBtn.classList.add("pop");
          setTimeout(() => likeBtn.classList.remove("pop"), 300);
        }
        setLikedArtworks(liked);
      });

   const viewBtn = card.querySelector(".view-btn");
viewBtn.addEventListener("click", () => {
  window.location.href = `art.html?id=${art.id}`;
});
      // Add the card to the gallery grid
      gallery.appendChild(card);
    });
  }

  // Fetch and display artworks when the page loads
  fetchArtworks().then(displayArtworks);
});