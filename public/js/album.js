let currentAlbum = null;
let currentIndex = 0;
const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");

currentAlbum = albums.find(a => a.id === albumId);
const album = currentAlbum;

const albumTitle = document.getElementById("album-title");
const albumDescription = document.getElementById("album-description");
const albumGrid = document.getElementById("album-grid");

if (!album) {

    albumTitle.textContent = "Album Not Found";

} else {

    albumTitle.textContent = album.title;

    albumDescription.innerHTML = `
        ${album.description}<br>
        <strong>${album.total} Photos</strong>
`;

    for (let i = 1; i <= album.total; i++) {

        const figure = document.createElement("figure");

        figure.className = "gallery__item";

        figure.innerHTML = `
            <img
                loading="lazy"
                src="/gallery/${album.folder}/${i}.jpeg"
                class="gallery__img"
                alt="${album.title}"
                onclick="openLightbox(${i}, '${album.title}')"
            >
        `;

        albumGrid.appendChild(figure);

    }

}

function openLightbox(index, title) {

    currentIndex = index;

    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lightbox__image");
    const caption = document.getElementById("lightbox__caption");

    image.src = `/gallery/${currentAlbum.folder}/${currentIndex}.jpeg`;

    caption.textContent =
        `${title} (${currentIndex}/${currentAlbum.total})`;

    lightbox.classList.add("active");

    document.body.style.overflow = "hidden";
}

function closeLightbox(event) {

    if (event && event.target.id !== "lightbox") return;

    document.getElementById("lightbox").classList.remove("active");

    document.body.style.overflow = "";
}

function nextImage(event) {

    event.stopPropagation();

    if (currentIndex < currentAlbum.total) {

        currentIndex++;

    } else {

        currentIndex = 1;

    }

    openLightbox(currentIndex, currentAlbum.title);

}

function previousImage(event) {

    event.stopPropagation();

    if (currentIndex > 1) {

        currentIndex--;

    } else {

        currentIndex = currentAlbum.total;

    }

    openLightbox(currentIndex, currentAlbum.title);

}

document.addEventListener("keydown", e => {

    const lightbox =
        document.getElementById("lightbox");

    if (!lightbox.classList.contains("active"))
        return;

    if (e.key === "ArrowRight")
        nextImage(e);

    if (e.key === "ArrowLeft")
        previousImage(e);

    if (e.key === "Escape")
        closeLightbox();

});