const gallery = document.getElementById("artGallery");
const artistSelect = document.getElementById("artistSelect");


async function fetchArtworks() {
    const response = await fetch("https://api.artic.edu/api/v1/artworks?limit=20");
    const data = await response.json();
    return data.data;
}


function displayArtworks(artworks) {
    gallery.innerHTML="";
    artworks.forEach(art => {
    const imgUrl = art.image_id
    ?`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`
    :"https://via.placeholder.com/300x300.png?text=No+Image";

    const card = document.createElement("div");
    card.classList.add("col-md-4");

    card.innerHTML = `
    <div class= "card shadow-sm h-100">
        <img scr="${imgUrl}" class="card-img-top" alt="${art.title}">
        <div class="card-body">
        <h5 class="card-title">${art.title}</h5>
        <p class="card-text text-muted">${art.artist_title || "Unknown Artist"}</p>
        <button class="btn btn-outline-danger like-btn">
         ❤️ Like
         </button>
         </div>
         </div>
            `;

            const likeBtn = card.querySelector(".like-btn");
            likeBtn.addEventListener("click",() => {
                likeBtn.classList.toggle("liked");
                likeBtn.textContent = likeBtn.classList.contains("liked") ? "❤️ Liked" : "❤️ Like";
            });

            gallery.appendChild(card);
        });
    }


    async function fetchArtists() {
        const response = await fetch("https://api.artic.edu/api/v1/artists?limit=50");
        const data = await response.json();
        return data.data;

        artistSelect.forEach(artist => {
            const option =document.createElement("option");
            option.value = artist.title;
            option.textContent = artist.title;
            artistSelect.appendChild(option);
        });
    
    }


    artistSelect.addEventListener("change", async () => {
        const selected = artistSelect.value;
        let artworks = await fetchArtworks();

        if (selected) {
            artworks = artworks.filter(a => a.artist_title === selected);
        
        }
        displayArtworks(artworks);
    });


    


