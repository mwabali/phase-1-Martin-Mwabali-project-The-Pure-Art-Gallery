# The Pure Art Gallery

## Description

**The Pure Art Gallery** is a modern, interactive web application that allows users to discover, like, and comment on artworks from the [Art Institute of Chicago API](https://api.artic.edu/docs/).  
The project demonstrates advanced JavaScript concepts including:

- **DOM Manipulation:** Dynamically creating and updating HTML elements for art cards, artist lists, and comments.
- **Event Handling:** Handling user interactions such as liking art, viewing details, searching, and commenting.
- **API Fetching:** Using `fetch()` to retrieve data from a public REST API.
- **Local Storage:** Persisting user likes and comments across sessions using `localStorage`.
- **Single Page Navigation:** Simulating navigation between multiple pages (Home, Discover, Artists, Favorites, Art Details) using separate HTML files and JavaScript.
- **Responsive Design:** Using Bootstrap and custom CSS for a visually appealing, mobile-friendly interface.

---

## Setup Instructions

### 1. **Clone the Repository**

Open your terminal and run:

```bash
git clone <repository-url>
cd phase-1-Martin-Mwabali-project-The-Pure-Art-Gallery
```

Replace `<repository-url>` with the actual URL of this repository.

---

### 2. **Install Dependencies**

This project uses only vanilla JavaScript, Bootstrap (via CDN), and does **not** require Node.js or npm.  
No installation of dependencies is needed.

---

### 3. **Run the Application Locally**

Because the app fetches data from an external API, you must run it on a local server (not by double-clicking the HTML files).

**If you have Python installed, run:**

```bash
python3 -m http.server
```

Then open your browser and go to:  
[http://localhost:8000](http://localhost:8000)

---

## How to Use

- **Home:** Browse a grid of artworks, like your favorites, and search by artist or artwork name.
- **Discover:** See a new, randomized selection of art every time you refresh.
- **Artists:** Browse all artists, click to view all their works.
- **Favorites:** View all your liked artworks in one place.
- **Art Details:** Click "View More" on any artwork to see it in detail, like/unlike, and leave comments.

All likes and comments are saved in your browser using `localStorage`.

---

## JavaScript Concepts Demonstrated

- **DOM Manipulation:** Creating cards, lists, and forms dynamically.
- **Event Listeners:** For buttons, forms, and navigation.
- **API Fetching:** Using `fetch()` and handling JSON data.
- **Local Storage:** Saving and retrieving likes and comments.
- **Array Methods:** `forEach`, `map`, `filter`, and custom shuffle.
- **Responsive UI:** Bootstrap grid and custom CSS for a modern look.

---

## Expected Output

- A visually rich, interactive art gallery experience.
- All features work in modern browsers (Chrome, Firefox, Edge, Safari).
- No backend or database required—everything runs in the browser.

---

## Credits

- Art data and images: [Art Institute of Chicago API](https://api.artic.edu/docs/)
- UI: Bootstrap 5, custom CSS

---

**Enjoy exploring The Pure Art Gallery!**