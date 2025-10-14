const gallery = document.getElementById("artGallery");
const artistSelect = document.getElementById("artistSelect");


async function fetchArtworks() {
    const response = await fetch("https://api.artic.edu/api/v1/artworks?limit=20");
    const data = await response.json();
    return data.data;
}