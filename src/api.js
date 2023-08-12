import axios from "axios";

export async function getPhotos(query, page, perPage) {
       
        const API_KEY = '38756326-a9c3d4d4b95b73173c7191d42';
        const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;

        const response = await axios.get(URL);
        return response.data;
}

   