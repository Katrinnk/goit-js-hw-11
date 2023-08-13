
const gallery = document.querySelector('.gallery');

export function createMarkup(photos){
    const markup = photos.map(photo => `
    <div class="photo-card">
        <a class="gallery-link" href="${photo.webformatURL}">
            <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
        </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${photo.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${photo.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${photo.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${photo.downloads}
        </p>
      </div>
    </div>
  `).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
