import  {Notify}  from 'notiflix';


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


async  function Submit(e) {
      e.preventDefault();
      gallery.innerHTML = '';
      query = e.target.searchQuery.value.trim();

        if (query === '') {
          Notify.info('Write something, please!');
          return;
        }

        getPhotos(query, page, perPage)
        .then((data) => {
          const photos = data.hits;
          
          if (data.totalHits === 0){
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
          }else{
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
            createMarkup(photos);
            loadMore();
            lightboxGallery.refresh();
          }
        })
        .catch((e) => {
          console.error(e);
          Notify.failure(`Error searching images: ${e}`);
        })
        .finally(() => form.reset());
      }  
        

   function loadMore(){
  
    getPhotos(query, page, perPage)
    .then((data) => {
      const currentPage = Math.ceil(data.totalHits / perPage);
      console.log(currentPage);
      console.log(page);

      if (page === currentPage){
        Notify.info('We\`re sorry, but you\'ve reached the end of search results');
        loadMoreBtn.classList.add('hidden');
      }else{
        createMarkup(data.hits);
        loadMoreBtn.classList.remove('hidden');
        scroll();
        lightboxGallery.refresh();
        page +=1;
       }
    })
    .catch((e) => Notify.failure(`Oops! Something went wrong! Try reloading the page! ${e}`));
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