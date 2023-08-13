import  {Notify}  from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { getPhotos } from './api';
import { createMarkup } from './markup';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

let page = 1;
let query = '';
const perPage = 40;

loadMoreBtn.classList.add('hidden');

form.addEventListener('submit', Submit);
loadMoreBtn.addEventListener('click', loadMore);


 function Submit(e) {
      e.preventDefault();
      gallery.innerHTML = '';
      query = e.target.searchQuery.value.trim();

        if (query === '') {
          Notify.info('Write something, please!');
          return;
        }

        getPhotos(query, page, perPage)
        .then((data) => {
          
          if (data.totalHits === 0){
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            return;
          }
    
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
            createMarkup(data.hits);
            lightboxGallery.refresh();

            if (data.totalHits > perPage) {
              loadMoreBtn.classList.remove('hidden');
            }    
        })
        .catch((e) => {
          console.error(e);
          Notify.failure(`Error searching images: ${e}`);
        })
        .finally(() => form.reset());
      }  
        

   function loadMore(){
  
    page +=1; 

    getPhotos(query, page, perPage)
    .then((data) => {
      const currentPage = Math.ceil(data.totalHits / perPage);
      console.log(currentPage);
      console.log(page);

      loadMoreBtn.classList.remove('hidden');
      createMarkup(data.hits);
      lightboxGallery.refresh();
      scroll(); 

      if (page === currentPage){
        loadMoreBtn.classList.add('hidden');
        Notify.info('We\`re sorry, but you\'ve reached the end of search results');
      }
    })
    .catch((e) => Notify.failure(`Oops! Something went wrong! Try reloading the page! ${e}`))
    .finally(() => form.reset());
    }


  
    const lightboxGallery = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });

    function scroll () {
      const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: "smooth",
        });
    }