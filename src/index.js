import  {Notify}  from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { getPhotos } from './api';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

let page = 1;
let query = '';
const perPage = 40;

loadMoreBtn.classList.add('hidden');

form.addEventListener('submit', Submit);
loadMoreBtn.addEventListener('click', loadMore);

const lightboxGallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

 async function Submit(e) {
      e.preventDefault();
      gallery.innerHTML = '';
      query = e.target.searchQuery.value.trim();

        if (query === '') {
          Notify.info('Write something, please!');
          return;
        }
    
       
        try {
            const photos = await getPhotos(query, page, perPage);
            console.log(photos);
    


            if (photos.length === 0) {
              Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            } else {
              Notify.success(`Hooray! We found ${photos.length} images.`)
              createMarkup(photos);
              loadMore(); 
              lightboxGallery.refresh();
            }
          } catch (e) {
            console.error(e);
            Notify.failure('Error searching images:', e);
          } finally{
            form.reset();}
        }

  async function loadMore() {
   
    page +=1;
    
        try {
            const photos = await getPhotos(query, page, perPage);
            if (photos.length > perPage) {
                loadMoreBtn.classList.remove('hidden');
                createMarkup(photos);
                lightboxGallery.refresh();
              if (photos.length <= 40) {
                loadMoreBtn.classList.add('hidden');
                Notify.info('We\`re sorry, but you\'ve reached the end of search results');
              }
            }
          } catch {
            Notify.failure('Oops! Something went wrong! Try reloading the page!')
          }
        }

function createMarkup(photos){
    gallery.innerHTML = '';
    const markup = photos.map(photo => `
    <div class="photo-card">
        <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
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
