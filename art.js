// Utility: Get query param by name
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Get/set likes in localStorage
function getLikedArtworks() {
  return JSON.parse(localStorage.getItem("likedArtworks") || "[]");
}
function setLikedArtworks(ids) {
  localStorage.setItem("likedArtworks", JSON.stringify(ids));
}

// Comments: store per artwork
function getComments(artId) {
  return JSON.parse(localStorage.getItem(`comments_${artId}`) || "[]");
}
function setComments(artId, comments) {
  localStorage.setItem(`comments_${artId}`, JSON.stringify(comments));
}

document.addEventListener("DOMContentLoaded", async () => {
  const artId = getQueryParam("id");
  if (!artId) {
    document.querySelector(".art-details-content").innerHTML = "<div class='text-danger'>No artwork selected.</div>";
    return;
  }

  // Elements
  const img = document.getElementById("detailsImage");
  const title = document.getElementById("detailsTitle");
  const artist = document.getElementById("detailsArtist");
  const desc = document.getElementById("detailsDescription");
  const likeBtn = document.getElementById("detailsLikeBtn");
  const heartIcon = likeBtn.querySelector(".heart-icon");
  const commentsList = document.getElementById("commentsList");
  const commentForm = document.getElementById("commentForm");
  const commentInput = document.getElementById("commentInput");

  // Fetch artwork details
  const response = await fetch(`https://api.artic.edu/api/v1/artworks/${artId}`);
  const data = await response.json();
  const art = data.data;

  // Fill details
  img.src = art.image_id
    ? `https://www.artic.edu/iiif/2/${art.image_id}/full/900,/0/default.jpg`
    : "https://via.placeholder.com/600x400.png?text=No+Image";
  img.alt = art.title;
  title.textContent = art.title;
  artist.textContent = art.artist_title || "Unknown Artist";
  desc.textContent = art.thumbnail?.alt_text || art.date_display || "No description available.";

  // Like button logic
  function updateLikeBtn() {
    const liked = getLikedArtworks();
    if (liked.includes(art.id)) {
      likeBtn.classList.add("liked");
      heartIcon.setAttribute("fill", "red");
    } else {
      likeBtn.classList.remove("liked");
      heartIcon.setAttribute("fill", "none");
    }
  }
  updateLikeBtn();

  likeBtn.addEventListener("click", () => {
    let liked = getLikedArtworks();
    if (liked.includes(art.id)) {
      liked = liked.filter(id => id !== art.id);
    } else {
      liked.push(art.id);
      likeBtn.classList.add("pop");
      setTimeout(() => likeBtn.classList.remove("pop"), 300);
    }
    setLikedArtworks(liked);
    updateLikeBtn();
  });

  // Comments logic
  function renderComments() {
    const comments = getComments(art.id);
    commentsList.innerHTML = "";
    comments.forEach((comment, idx) => {
      const li = document.createElement("li");
      li.textContent = comment;
      li.className = "d-flex justify-content-between align-items-center";
      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.className = "btn btn-sm btn-outline-danger ms-2";
      delBtn.onclick = () => {
        const updated = comments.filter((_, i) => i !== idx);
        setComments(art.id, updated);
        renderComments();
      };
      li.appendChild(delBtn);
      commentsList.appendChild(li);
    });
  }
  renderComments();

  commentForm.addEventListener("submit", e => {
    e.preventDefault();
    const val = commentInput.value.trim();
    if (!val) return;
    const comments = getComments(art.id);
    comments.push(val);
    setComments(art.id, comments);
    commentInput.value = "";
    renderComments();
  });
});