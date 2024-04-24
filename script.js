document.addEventListener('DOMContentLoaded', function () {
  displayMovies(1);
});

//   Authorization
function getAuthorizaiton() {
  return (options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkN2RkNzc4ZDJmMzQxYzA5NjY2MmY5ZjQ0MjYzYjY0ZSIsInN1YiI6IjY1YzUwNjU0MTk0MTg2MDE2Mjc1ZTA2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3pn0_lr-lCIVOigU8uHz6BcWtEGSXbSsQlbASJgoL84',
    },
  });
}

//   Geners
function getGenresData() {
  return {
    genres: [
      {
        id: 28,
        name: 'Action',
      },
      {
        id: 12,
        name: 'Adventure',
      },
      {
        id: 16,
        name: 'Animation',
      },
      {
        id: 35,
        name: 'Comedy',
      },
      {
        id: 80,
        name: 'Crime',
      },
      {
        id: 99,
        name: 'Documentary',
      },
      {
        id: 18,
        name: 'Drama',
      },
      {
        id: 10751,
        name: 'Family',
      },
      {
        id: 14,
        name: 'Fantasy',
      },
      {
        id: 36,
        name: 'History',
      },
      {
        id: 27,
        name: 'Horror',
      },
      {
        id: 10402,
        name: 'Music',
      },
      {
        id: 9648,
        name: 'Mystery',
      },
      {
        id: 10749,
        name: 'Romance',
      },
      {
        id: 878,
        name: 'Science Fiction',
      },
      {
        id: 10770,
        name: 'TV Movie',
      },
      {
        id: 53,
        name: 'Thriller',
      },
      {
        id: 10752,
        name: 'War',
      },
      {
        id: 37,
        name: 'Western',
      },
    ],
  };
}
function mapGenres(currentMovie) {
  const genresJSONData = getGenresData();

  const genresData = genresJSONData.genres; // Accesses the "genres" array

  let genreNames = [];

  for (let i = 0; i < currentMovie.genre_ids.length; i++) {
    for (let j = 0; j < genresData.length; j++) {
      if (genresData[j].id === currentMovie.genre_ids[i]) {
        genreNames += genresData[j].name + ', ';
      }
    }
  }

  return genreNames.slice(0, -2);
}

// PAGINATION
const paginationButtons = document.getElementById('pagination-buttons');
let currentPage = 1;

function generatePaginationButtons(totalPages, movieTitle = "") {
  // console.log('generatePaginationButtons', { movieTitle })

  paginationButtons.innerHTML = '';

  const maxButtons = 5; // Maximum number of buttons to show
  const halfMaxButtons = Math.floor(maxButtons / 2);
  const startPage = Math.max(1, currentPage - halfMaxButtons);
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (startPage > 1) {
    addPaginationButton(1, movieTitle);
    if (startPage > 2) {
      paginationButtons.appendChild(createDots());
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    addPaginationButton(i, movieTitle);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationButtons.appendChild(createDots());
    }
    addPaginationButton(totalPages, movieTitle);
  }
}
function addPaginationButton(pageNumber, movieTitle = "") {
  // console.log('generatePaginationButtons', { movieTitle })

  const button = document.createElement('button');
  button.textContent = pageNumber;
  button.classList.add('btn', 'rounded-0');
  button.addEventListener('click', () => {
    currentPage = pageNumber;
    if (movieTitle !== "") {
      searchAndDisplayMovie(movieTitle, currentPage);
    } else displayMovies(currentPage);
  });

  if (pageNumber === currentPage) {
    button.classList.add('btn-primary');
  } else {
    button.classList.add('btn-dark');
  }

  paginationButtons.appendChild(button);
}
function createDots() {
  const dotsSpan = document.createElement('span');
  dotsSpan.textContent = '...';
  return dotsSpan;
}

//home btn
const homeBtn = document.getElementById('home-btn');
homeBtn.addEventListener('click', () => {
  displayMovies(1);
});

//FOR MOVIE TRAILERS
async function getMovieId(movieTitle) {
  console.log('getMovieId', { movieTitle })
  const encodedMovieTitle = encodeURIComponent(movieTitle);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=d7dd778d2f341c096662f9f44263b64e&query=${encodedMovieTitle}`;
  const response = await fetch(url, getAuthorizaiton());
  const searchResults = JSON.parse(await response.text());
  console.log('getMovieId', { searchResults });
  return searchResults.results[0].id;
}

async function getMovieTrailer(id) {
  try {
    const url = `https://api.kinocheck.de/movies?tmdb_id=${id}`;
    const response = await fetch(url);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error fetching the data:', error)
  }
}

// MOVIES
/*IMPLEMENT TRY CATCH TO PRINT MOVIE DATA AND SEPARATE DISPLAY AND FETCH DATA SEPARATELY*/
async function displayMovies(page) {
  const url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`;

  fetch(url, getAuthorizaiton())
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const JSONdata = JSON.parse(data);

      const trendingOverviewContainer =
        document.getElementById('trending-overview');
      const modalContainer = document.getElementById(
        'trending-modal-container'
      );
      const modalPoster = document.querySelector('.modal-poster');
      const modalTitle = document.getElementById('modal-title');
      const modalOverview = document.getElementById('modal-overview');
      const modalReleaseDate = document.getElementById('modal-release-date');
      const modalRating = document.getElementById('modal-rating');
      const modalGenres = document.getElementById('modal-genres');
      const closeButton = document.querySelector('.close-button');
      const modalTrailer = document.querySelector('.modal-trailer');

      trendingOverviewContainer.innerHTML = '';

      for (let i = 0; i < JSONdata.results.length; i++) {
        const currentMovie = JSONdata.results[i];

        const movieElement = document.createElement('div');
        movieElement.classList.add(
          'movie-item',
          'col-6',
          'col-sm-6',
          'col-md-4',
          'col-lg-3'
        );

        //dialogue
        const moviePoster = document.createElement('img');
        moviePoster.src =
          'https://image.tmdb.org/t/p/w185' + currentMovie.poster_path;

        moviePoster.style.width = '100%';
        moviePoster.style.height = 'auto'; // Maintain aspect ratio
        moviePoster.style.padding = '1rem';
        moviePoster.style.borderRadius = '1rem';
        
        // const iframe = document.createElement('iframe');        
        // iframe.setAttribute('width', '560');
        // iframe.setAttribute('height', '315');
        // iframe.setAttribute('frameborder', '0');
        // iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        // iframe.setAttribute('allowfullscreen', '');        


        let trailerContainer;
        
        moviePoster.addEventListener('click', async () => {

          // const id = await getMovieId(currentMovie.title);
          // const videoData = await getMovieTrailer(id);
          // const ytVideoId = JSON.parse(videoData);
          // console.log( "ytVideoId", ytVideoId );
          
          // // Clear previous content from modalTrailer
          // modalTrailer.innerHTML = '';

          
          // if(ytVideoId && ytVideoId.trailer !== null){
          //   const embedUrl = `https://www.youtube.com/embed/${ytVideoId.trailer.youtube_video_id}`;
          //   console.log(embedUrl);
          //   // iframe.setAttribute('src', embedUrl);
          //   // modalTrailer.appendChild(iframe);
          //   modalTrailer.src = embedUrl;
          // }
          modalPoster.src = moviePoster.src;
          modalTitle.textContent = currentMovie.title;
          modalOverview.textContent = currentMovie.overview;
          modalReleaseDate.textContent = currentMovie.release_date;
          modalRating.textContent =
            Math.round(currentMovie.vote_average * 10) / 10;
          modalGenres.textContent = mapGenres(currentMovie);
          
          
          // Embedding YouTube trailer
          trailerContainer = document.createElement('div');
          trailerContainer.innerHTML = `
            <video width="100px" height="315px" autoplay>
              <source src="https://www.youtube.com/embed/yCVcxbkudg0">
            </video>
          `;
          modalContainer.appendChild(trailerContainer);


          modalContainer.style.display = 'flex';
          (modalContainer.style.justifyContent = 'center'),
            (modalContainer.style.alignItems = 'center');
        });

        movieElement.appendChild(moviePoster);

        const movieTitle = document.createElement('h5');
        movieTitle.classList.add('pt-2', 'text-center');
        movieTitle.textContent = currentMovie.title;
        movieElement.appendChild(movieTitle);

        trendingOverviewContainer.appendChild(movieElement);
      }

      closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
        trailerContainer.remove();
      });

      document.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
          modalContainer.style.display = 'none';
        }
      });

      generatePaginationButtons(JSONdata.total_pages / 10);
    })
    .catch((error) => console.error('Error fetching the data:', error));
}

async function dispMovieTitleAsc() {
  const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

  fetch(url, getAuthorizaiton())
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const JSONdata = JSON.parse(data);

      const movies = JSONdata.results;

      for (let i = 0; i < movies.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < movies.length; j++) {
          if (
            movies[j].title.toLowerCase() < movies[minIndex].title.toLowerCase()
          ) {
            minIndex = j;
          }
        }
        if (i !== minIndex) {
          const temp = movies[i];
          movies[i] = movies[minIndex];
          movies[minIndex] = temp;
        }
      }

      const trendingOverviewContainer =
        document.getElementById('trending-overview');
      const modalContainer = document.getElementById(
        'trending-modal-container'
      );
      const modalPoster = document.querySelector('.modal-poster');
      const modalTitle = document.getElementById('modal-title');
      const modalOverview = document.getElementById('modal-overview');
      const modalReleaseDate = document.getElementById('modal-release-date');
      const modalRating = document.getElementById('modal-rating');
      const modalGenres = document.getElementById('modal-genres');
      const closeButton = document.querySelector('.close-button');

      trendingOverviewContainer.innerHTML = '';

      for (let i = 0; i < JSONdata.results.length; i++) {
        const currentMovie = movies[i];

        const movieElement = document.createElement('div');
        movieElement.classList.add(
          'movie-item',
          'col-6',
          'col-sm-6',
          'col-md-4',
          'col-lg-3'
        );

        const moviePoster = document.createElement('img');
        moviePoster.src =
          'https://image.tmdb.org/t/p/w185' + currentMovie.poster_path;

        moviePoster.style.width = '100%';
        moviePoster.style.height = 'auto'; // Maintain aspect ratio
        moviePoster.style.padding = '1rem';
        moviePoster.style.borderRadius = '1rem';

        moviePoster.addEventListener('click', async () => {
          modalPoster.src = moviePoster.src;
          modalTitle.textContent = currentMovie.title;
          modalOverview.textContent = currentMovie.overview;
          modalReleaseDate.textContent = currentMovie.release_date;
          modalRating.textContent =
            Math.round(currentMovie.vote_average * 10) / 10;
          modalGenres.textContent = mapGenres(currentMovie);

          modalContainer.style.display = 'flex';
          (modalContainer.style.justifyContent = 'center'),
            (modalContainer.style.alignItems = 'center');
        });

        movieElement.appendChild(moviePoster);

        const movieTitle = document.createElement('h5');
        movieTitle.classList.add('pt-2', 'text-center');
        movieTitle.textContent = currentMovie.title;
        movieElement.appendChild(movieTitle);

        trendingOverviewContainer.appendChild(movieElement);
      }

      closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
      });

      document.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
          modalContainer.style.display = 'none';
        }
      });
    })
    .catch((error) => console.error('Error fetching the data:', error));
}

async function dispMovieTitleDesc() {
  const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

  fetch(url, getAuthorizaiton())
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const JSONdata = JSON.parse(data);

      const movies = JSONdata.results;

      for (let i = 0; i < movies.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < movies.length; j++) {
          if (
            movies[j].title.toLowerCase() > movies[minIndex].title.toLowerCase()
          ) {
            minIndex = j;
          }
        }
        if (i !== minIndex) {
          const temp = movies[i];
          movies[i] = movies[minIndex];
          movies[minIndex] = temp;
        }
      }

      const trendingOverviewContainer =
        document.getElementById('trending-overview');
      const modalContainer = document.getElementById(
        'trending-modal-container'
      );
      const modalPoster = document.querySelector('.modal-poster');
      const modalTitle = document.getElementById('modal-title');
      const modalOverview = document.getElementById('modal-overview');
      const modalReleaseDate = document.getElementById('modal-release-date');
      const modalRating = document.getElementById('modal-rating');
      const modalGenres = document.getElementById('modal-genres');
      const closeButton = document.querySelector('.close-button');

      trendingOverviewContainer.innerHTML = '';

      for (let i = 0; i < JSONdata.results.length; i++) {
        const currentMovie = movies[i];

        const movieElement = document.createElement('div');
        movieElement.classList.add(
          'movie-item',
          'col-6',
          'col-sm-6',
          'col-md-4',
          'col-lg-3'
        );

        const moviePoster = document.createElement('img');
        moviePoster.src =
          'https://image.tmdb.org/t/p/w185' + currentMovie.poster_path;

        moviePoster.style.width = '100%';
        moviePoster.style.height = 'auto'; // Maintain aspect ratio
        moviePoster.style.padding = '1rem';
        moviePoster.style.borderRadius = '1rem';

        moviePoster.addEventListener('click', async () => {
          modalPoster.src = moviePoster.src;
          modalTitle.textContent = currentMovie.title;
          modalOverview.textContent = currentMovie.overview;
          modalReleaseDate.textContent = currentMovie.release_date;
          modalRating.textContent =
            Math.round(currentMovie.vote_average * 10) / 10;
          modalGenres.textContent = mapGenres(currentMovie);

          modalContainer.style.display = 'flex';
          (modalContainer.style.justifyContent = 'center'),
            (modalContainer.style.alignItems = 'center');
        });

        movieElement.appendChild(moviePoster);

        const movieTitle = document.createElement('h5');
        movieTitle.classList.add('pt-2', 'text-center');

        movieTitle.textContent = currentMovie.title;
        movieElement.appendChild(movieTitle);

        trendingOverviewContainer.appendChild(movieElement);
      }

      closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
      });

      document.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
          modalContainer.style.display = 'none';
        }
      });
    })
    .catch((error) => console.error('Error fetching the data:', error));
}

function dispMovieDateAsc() {
  const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

  fetch(url, getAuthorizaiton())
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const JSONdata = JSON.parse(data);

      const movies = JSONdata.results;

      for (let i = 0; i < movies.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < movies.length; j++) {
          if (
            movies[j].release_date.toLowerCase() >
            movies[minIndex].release_date.toLowerCase()
          ) {
            minIndex = j;
          }
        }
        if (i !== minIndex) {
          const temp = movies[i];
          movies[i] = movies[minIndex];
          movies[minIndex] = temp;
        }
      }

      const trendingOverviewContainer =
        document.getElementById('trending-overview');
      const modalContainer = document.getElementById(
        'trending-modal-container'
      );
      const modalPoster = document.querySelector('.modal-poster');
      const modalTitle = document.getElementById('modal-title');
      const modalOverview = document.getElementById('modal-overview');
      const modalReleaseDate = document.getElementById('modal-release-date');
      const modalRating = document.getElementById('modal-rating');
      const modalGenres = document.getElementById('modal-genres');
      const closeButton = document.querySelector('.close-button');

      trendingOverviewContainer.innerHTML = '';

      for (let i = 0; i < JSONdata.results.length; i++) {
        const currentMovie = movies[i];

        const movieElement = document.createElement('div');
        movieElement.classList.add(
          'movie-item',
          'col-6',
          'col-sm-6',
          'col-md-4',
          'col-lg-3'
        );

        const moviePoster = document.createElement('img');
        moviePoster.src =
          'https://image.tmdb.org/t/p/w185' + currentMovie.poster_path;

        moviePoster.style.width = '100%';
        moviePoster.style.height = 'auto'; // Maintain aspect ratio
        moviePoster.style.padding = '1rem';

        moviePoster.addEventListener('click', async () => {
          modalPoster.src = moviePoster.src;
          modalTitle.textContent = currentMovie.title;
          modalOverview.textContent = currentMovie.overview;
          modalReleaseDate.textContent = currentMovie.release_date;
          modalRating.textContent =
            Math.round(currentMovie.vote_average * 10) / 10;
          modalGenres.textContent = mapGenres(currentMovie);

          modalContainer.style.display = 'flex';
          (modalContainer.style.justifyContent = 'center'),
            (modalContainer.style.alignItems = 'center');
        });

        movieElement.appendChild(moviePoster);

        const movieTitle = document.createElement('h5');
        movieTitle.classList.add('pt-2', 'text-center');

        movieTitle.textContent = currentMovie.title;
        movieElement.appendChild(movieTitle);

        trendingOverviewContainer.appendChild(movieElement);
      }

      closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
      });

      document.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
          modalContainer.style.display = 'none';
        }
      });
    })
    .catch((error) => console.error('Error fetching the data:', error));
}

function dispMovieDateDesc() {
  const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

  fetch(url, getAuthorizaiton())
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const JSONdata = JSON.parse(data);

      const movies = JSONdata.results;

      for (let i = 0; i < movies.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < movies.length; j++) {
          if (
            movies[j].release_date.toLowerCase() <
            movies[minIndex].release_date.toLowerCase()
          ) {
            minIndex = j;
          }
        }
        if (i !== minIndex) {
          const temp = movies[i];
          movies[i] = movies[minIndex];
          movies[minIndex] = temp;
        }
      }

      const trendingOverviewContainer =
        document.getElementById('trending-overview');
      const modalContainer = document.getElementById(
        'trending-modal-container'
      );
      const modalPoster = document.querySelector('.modal-poster');
      const modalTitle = document.getElementById('modal-title');
      const modalOverview = document.getElementById('modal-overview');
      const modalReleaseDate = document.getElementById('modal-release-date');
      const modalRating = document.getElementById('modal-rating');
      const modalGenres = document.getElementById('modal-genres');
      const closeButton = document.querySelector('.close-button');

      trendingOverviewContainer.innerHTML = '';

      for (let i = 0; i < JSONdata.results.length; i++) {
        const currentMovie = movies[i];

        const movieElement = document.createElement('div');
        movieElement.classList.add(
          'movie-item',
          'col-6',
          'col-sm-6',
          'col-md-4',
          'col-lg-3'
        );

        const moviePoster = document.createElement('img');
        moviePoster.src =
          'https://image.tmdb.org/t/p/w185' + currentMovie.poster_path;

        moviePoster.style.width = '100%';
        moviePoster.style.height = 'auto'; // Maintain aspect ratio
        moviePoster.style.padding = '1rem';

        moviePoster.addEventListener('click', async () => {
          modalPoster.src = moviePoster.src;
          modalTitle.textContent = currentMovie.title;
          modalOverview.textContent = currentMovie.overview;
          modalReleaseDate.textContent = currentMovie.release_date;
          modalRating.textContent =
            Math.round(currentMovie.vote_average * 10) / 10;
          modalGenres.textContent = mapGenres(currentMovie);

          modalContainer.style.display = 'flex';
          (modalContainer.style.justifyContent = 'center'),
            (modalContainer.style.alignItems = 'center');
        });

        movieElement.appendChild(moviePoster);

        const movieTitle = document.createElement('h5');
        movieTitle.classList.add('pt-2', 'text-center');

        movieTitle.textContent = currentMovie.title;
        movieElement.appendChild(movieTitle);

        trendingOverviewContainer.appendChild(movieElement);
      }

      closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
      });

      document.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
          modalContainer.style.display = 'none';
        }
      });
    })
    .catch((error) => console.error('Error fetching the data:', error));
}

function dispMovieRatingAsc() {
  const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

  fetch(url, getAuthorizaiton())
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const JSONdata = JSON.parse(data);

      const movies = JSONdata.results;

      for (let i = 0; i < movies.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < movies.length; j++) {
          if (movies[j].vote_average < movies[minIndex].vote_average) {
            minIndex = j;
          }
        }
        if (i !== minIndex) {
          const temp = movies[i];
          movies[i] = movies[minIndex];
          movies[minIndex] = temp;
        }
      }

      const trendingOverviewContainer =
        document.getElementById('trending-overview');
      const modalContainer = document.getElementById(
        'trending-modal-container'
      );
      const modalPoster = document.querySelector('.modal-poster');
      const modalTitle = document.getElementById('modal-title');
      const modalOverview = document.getElementById('modal-overview');
      const modalReleaseDate = document.getElementById('modal-release-date');
      const modalRating = document.getElementById('modal-rating');
      const modalGenres = document.getElementById('modal-genres');
      const closeButton = document.querySelector('.close-button');

      trendingOverviewContainer.innerHTML = '';

      for (let i = 0; i < JSONdata.results.length; i++) {
        const currentMovie = movies[i];

        const movieElement = document.createElement('div');
        movieElement.classList.add(
          'movie-item',
          'col-6',
          'col-sm-6',
          'col-md-4',
          'col-lg-3'
        );

        const moviePoster = document.createElement('img');
        moviePoster.src =
          'https://image.tmdb.org/t/p/w185' + currentMovie.poster_path;

        moviePoster.style.width = '100%';
        moviePoster.style.height = 'auto'; // Maintain aspect ratio
        moviePoster.style.padding = '1rem';

        moviePoster.addEventListener('click', async () => {
          modalPoster.src = moviePoster.src;
          modalTitle.textContent = currentMovie.title;
          modalOverview.textContent = currentMovie.overview;
          modalReleaseDate.textContent = currentMovie.release_date;
          modalRating.textContent =
            Math.round(currentMovie.vote_average * 10) / 10;
          modalGenres.textContent = mapGenres(currentMovie);

          modalContainer.style.display = 'flex';
          (modalContainer.style.justifyContent = 'center'),
            (modalContainer.style.alignItems = 'center');
        });

        movieElement.appendChild(moviePoster);

        const movieTitle = document.createElement('h5');
        movieTitle.classList.add('pt-2', 'text-center');

        movieTitle.textContent = currentMovie.title;
        movieElement.appendChild(movieTitle);

        trendingOverviewContainer.appendChild(movieElement);
      }

      closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
      });

      document.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
          modalContainer.style.display = 'none';
        }
      });
    })
    .catch((error) => console.error('Error fetching the data:', error));
}

function dispMovieRatingDesc() {
  const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

  fetch(url, getAuthorizaiton())
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const JSONdata = JSON.parse(data);

      const movies = JSONdata.results;

      for (let i = 0; i < movies.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < movies.length; j++) {
          if (movies[j].vote_average > movies[minIndex].vote_average) {
            minIndex = j;
          }
        }
        if (i !== minIndex) {
          const temp = movies[i];
          movies[i] = movies[minIndex];
          movies[minIndex] = temp;
        }
      }

      const trendingOverviewContainer =
        document.getElementById('trending-overview');
      const modalContainer = document.getElementById(
        'trending-modal-container'
      );
      const modalPoster = document.querySelector('.modal-poster');
      const modalTitle = document.getElementById('modal-title');
      const modalOverview = document.getElementById('modal-overview');
      const modalReleaseDate = document.getElementById('modal-release-date');
      const modalRating = document.getElementById('modal-rating');
      const modalGenres = document.getElementById('modal-genres');
      const closeButton = document.querySelector('.close-button');

      trendingOverviewContainer.innerHTML = '';

      for (let i = 0; i < JSONdata.results.length; i++) {
        const currentMovie = movies[i];

        const movieElement = document.createElement('div');
        movieElement.classList.add(
          'movie-item',
          'col-6',
          'col-sm-6',
          'col-md-4',
          'col-lg-3'
        );

        const moviePoster = document.createElement('img');
        moviePoster.src =
          'https://image.tmdb.org/t/p/w185' + currentMovie.poster_path;

        moviePoster.style.width = '100%';
        moviePoster.style.height = 'auto'; // Maintain aspect ratio
        moviePoster.style.padding = '1rem';

        moviePoster.addEventListener('click', async () => {
          modalPoster.src = moviePoster.src;
          modalTitle.textContent = currentMovie.title;
          modalOverview.textContent = currentMovie.overview;
          modalReleaseDate.textContent = currentMovie.release_date;
          modalRating.textContent =
            Math.round(currentMovie.vote_average * 10) / 10;
          modalGenres.textContent = mapGenres(currentMovie);

          modalContainer.style.display = 'flex';
          (modalContainer.style.justifyContent = 'center'),
            (modalContainer.style.alignItems = 'center');
        });

        movieElement.appendChild(moviePoster);

        const movieTitle = document.createElement('h5');
        movieTitle.classList.add('pt-2', 'text-center');

        movieTitle.textContent = currentMovie.title;
        movieElement.appendChild(movieTitle);

        trendingOverviewContainer.appendChild(movieElement);
      }

      closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
      });

      document.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
          modalContainer.style.display = 'none';
        }
      });
    })
    .catch((error) => console.error('Error fetching the data:', error));
}

// SORTING & FILTER
const sortSelect = document.getElementById('sort-select');
const filterSelect = document.getElementById('filter-select');

sortSelect.addEventListener('change', async (event) => {
  const selectedSort = event.target.value;

  if (selectedSort === 'title-asc') {
    dispMovieTitleAsc();
  } else if (selectedSort === 'title-desc') {
    dispMovieTitleDesc();
  } else if (selectedSort === 'date-asc') {
    dispMovieDateAsc();
  } else if (selectedSort === 'date-desc') {
    dispMovieDateDesc();
  } else if (selectedSort === 'rating-asc') {
    dispMovieRatingAsc();
  } else if (selectedSort === 'rating-desc') {
    dispMovieRatingDesc();
  } else {
    displayMovies(currentPage);
  }
});

filterSelect.addEventListener('change', async (event) => {
  const selectedFilter = event.target.value;

  //   const url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${currentPage}`;
  const url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US`;

  fetch(url, getAuthorizaiton())
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const JSONdata = JSON.parse(data);

      const trendingOverviewContainer =
        document.getElementById('trending-overview');
      const modalContainer = document.getElementById(
        'trending-modal-container'
      );
      const modalPoster = document.querySelector('.modal-poster');
      const modalTitle = document.getElementById('modal-title');
      const modalOverview = document.getElementById('modal-overview');
      const modalReleaseDate = document.getElementById('modal-release-date');
      const modalRating = document.getElementById('modal-rating');
      const modalGenres = document.getElementById('modal-genres');
      const closeButton = document.querySelector('.close-button');

      trendingOverviewContainer.innerHTML = '';
      //   let numberOfPage = 0;

      for (let i = 0; i < JSONdata.results.length; i++) {
        const currentMovie = JSONdata.results[i];

        if (mapGenres(currentMovie).includes(selectedFilter)) {
          const movieElement = document.createElement('div');
          movieElement.classList.add(
            'movie-item',
            'col-6',
            'col-sm-6',
            'col-md-4',
            'col-lg-3'
          );

          const moviePoster = document.createElement('img');
          moviePoster.src =
            'https://image.tmdb.org/t/p/w185' + currentMovie.poster_path;

          moviePoster.style.width = '100%';
          moviePoster.style.height = 'auto'; // Maintain aspect ratio
          moviePoster.style.padding = '1rem';

          moviePoster.addEventListener('click', async () => {
            modalPoster.src = moviePoster.src;
            modalTitle.textContent = currentMovie.title;
            modalOverview.textContent = currentMovie.overview;
            modalReleaseDate.textContent = currentMovie.release_date;
            modalRating.textContent =
              Math.round(currentMovie.vote_average * 10) / 10;
            modalGenres.textContent = mapGenres(currentMovie);

            modalContainer.style.display = 'flex';
            (modalContainer.style.justifyContent = 'center'),
              (modalContainer.style.alignItems = 'center');
          });

          movieElement.appendChild(moviePoster);

          const movieTitle = document.createElement('h5');
          movieTitle.classList.add('pt-2', 'text-center');

          movieTitle.textContent = currentMovie.title;
          movieElement.appendChild(movieTitle);
          //   numberOfPage = movieElement.length;

          trendingOverviewContainer.appendChild(movieElement);
        } else if (selectedFilter === 'all') {
          displayMovies(currentPage);
        } else {
          continue;
        }
      }

      closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
      });

      document.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
          modalContainer.style.display = 'none';
        }
      });
        generatePaginationButtons(0);
    })
    .catch((error) => console.error('Error fetching the data:', error));
});

// SEARCH
const searchButton = document.getElementById('search-button');
const searchBox = document.getElementById('search-box');
const searchButtonMobile = document.getElementById('search-button-mobile');
const searchBoxMobile = document.getElementById('search-box-mobile');

const searchContainer = document.getElementById('.search-container');

const searchContainerMobile = document.getElementById(
  '.search-container-mobile'
);

//ADD EL FOR WHEN SEARCH BOX IS EMPTY TO CALL DISPLAY MOVIES AGAIN
searchButton.addEventListener('click', () => {
  const movieTitle = searchBox.value;
  console.log(movieTitle);
  if (movieTitle === '') {
    displayMovies(currentPage);
  } else {
    searchAndDisplayMovie(movieTitle);
  }
});

searchButtonMobile.addEventListener('click', () => {
  const movieTitle = searchBoxMobile.value;
  if (movieTitle === '') {
    displayMovies(currentPage);
  } else {
    searchAndDisplayMovie(movieTitle);
  }
});

async function searchAndDisplayMovie(movieTitle, page = 1) {
  console.log({ movieTitle });
  try {
    const API_KEY = 'd7dd778d2f341c096662f9f44263b64e'; // Replace with your TMDB API key
    const url =
      'https://api.themoviedb.org/3/search/movie?api_key=' +
      API_KEY +
      '&query=' +
      movieTitle +
      '&page=' +
      page;
    const response = await fetch(url, getAuthorizaiton());
    const searchResults = JSON.parse(await response.text());

    const trendingOverviewContainer =
      document.getElementById('trending-overview');
    const modalContainer = document.getElementById('trending-modal-container');
    const modalPoster = document.querySelector('.modal-poster');
    const modalTitle = document.getElementById('modal-title');
    const modalOverview = document.getElementById('modal-overview');
    const modalReleaseDate = document.getElementById('modal-release-date');
    const modalRating = document.getElementById('modal-rating');
    const modalGenres = document.getElementById('modal-genres');
    const closeButton = document.querySelector('.close-button');

    // Clear existing results
    trendingOverviewContainer.innerHTML = '';

    // Display the Results
    searchResults.results.forEach((movie) => {
      const movieElement = document.createElement('div');
      movieElement.classList.add(
        'movie-item',
        'col-6',
        'col-sm-6',
        'col-md-4',
        'col-lg-3'
      );

      const moviePoster = document.createElement('img');
      moviePoster.src = 'https://image.tmdb.org/t/p/w185' + movie.poster_path;

      moviePoster.style.width = '100%';
      moviePoster.style.height = 'auto'; // Maintain aspect ratio
      moviePoster.style.padding = '1rem';

      moviePoster.addEventListener('click', async () => {
        modalPoster.src = moviePoster.src;
        modalTitle.textContent = movie.title;
        modalOverview.textContent = movie.overview;
        modalReleaseDate.textContent = movie.release_date;
        modalRating.textContent = Math.round(movie.vote_average * 10) / 10;
        modalGenres.textContent = mapGenres(movie);

        modalContainer.style.display = 'flex';
        (modalContainer.style.justifyContent = 'center'),
          (modalContainer.style.alignItems = 'center');
      });

      movieElement.appendChild(moviePoster);

      const movieTitle = document.createElement('h5');
      movieTitle.classList.add('pt-2', 'text-center');

      movieTitle.textContent = movie.title;
      movieElement.appendChild(movieTitle);
      trendingOverviewContainer.appendChild(movieElement);
    });

    closeButton.addEventListener('click', () => {
      modalContainer.style.display = 'none';
    });

    document.addEventListener('click', (event) => {
      if (event.target === modalContainer) {
        modalContainer.style.display = 'none';
      }
    });
    generatePaginationButtons(searchResults.total_pages, movieTitle);
  } catch (error) {
    console.log('ERROR searching for movie', movie);
  }
}
