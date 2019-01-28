// Getting DOM elements
let searchForm = document.querySelector("#searchform");
let searchInput = document.querySelector("#searchText");
let movieResults = document.querySelector("#movies");
let movieResult = document.querySelector("#movie");
let footer = document.querySelector("#footer");

// Add Footer dynamically
let footerOutput = `
<div class="container">
            <div class="jumbotron">
                <h4 class="lead text-center">Powered by OMDB and TMDB API</h4>
                <h4 class="lead text-center">Designed with bootstrap 4</h4>
            </div>
          </div>
          `;

// listen for form submit
searchForm.addEventListener("submit", e => {
  let searchText = searchInput.value;
  getMovies(searchText);
  e.preventDefault();
});

// 98304107da83574cdac9140d458dce3d

// fucntion to get movies
function getMovies(searchText) {
  console.log(searchText);
  axios
    .get(
      "https://api.themoviedb.org/3/search/movie?api_key=98304107da83574cdac9140d458dce3d&query=" +
        searchText
    )
    .then(function(response) {
      console.log(response);
      let movies = response.data.results;
      let movieimg = "https://image.tmddb.org/t/p/w185";
      console.log(movies);
      let output = "";

      movies.forEach(movie => {
        movieimg = "https://image.tmdb.org/t/p/original" + movie.poster_path;
        output += `
              <div class="col-md-3">
                  <div class="well text-center">
                  <img src="${movieimg}">
                  <h5>${movie.title}</h5>
                  <a onclick="movieSelected('${
                    movie.id
                  }')" class="btn btn-primary" href="#"> Movie Details</a>
                  </div>
              </div>
            
              `;
      });

      movieResults.innerHTML = output;
      footer.innerHTML = footerOutput;
    })
    .catch(function(err) {
      console.log(err);
    });

  // get request to my OMDBapi key
  //   axios
  //   .get(" http://www.omdbapi.com/?t=" + searchText + "&apikey=bb4308b8")
  //   .then(function(response) {
  //       console.log(response);
  //     })
  //     .catch(function(error) {
  //       console.log(err);
  //     });
}

// method for single movie
function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  //   redirect to movie.html
  window.location = "movie.html";
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem("movieId");
  axios
    .get(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "?api_key=98304107da83574cdac9140d458dce3d"
    )
    .then(function(response) {
      console.log(response);
      let movie = response.data.imdb_id;
      //   Store imdb into Session
      sessionStorage.setItem("movieImdbId", String(movie));

      // Now query OMDBAPI for more detail with imdbid from TMDB
      let imdbId = sessionStorage.getItem("movieImdbId");
      axios
        .get("https://www.omdbapi.com/?i=" + imdbId + "&apikey=bb4308b8")
        .then(function(response) {
          console.log(response);
          let movie = response.data;
          let output = "";
          output += `                            
            <div class="row">
                <div class="col-md-4">
                    <img src="${movie.Poster}" class="thumbnail" alt="">
                </div>
                <div class="col-md-8">
                    <h2>${movie.Title}</h2>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Genre: </strong>${
                          movie.Genre
                        }</li>
                        <li class="list-group-item"><strong>Released: </strong>${
                          movie.Released
                        }</li>
                        <li class="list-group-item"><strong>Rated: </strong>${
                          movie.Rated
                        }</li>
                        <li class="list-group-item"><strong>IMDB Rating: </strong>${
                          movie.imdbRating
                        }</li>
                        <li class="list-group-item"><strong>Director: </strong>${
                          movie.Director
                        }</li>
                        <li class="list-group-item"><strong>Writer: </strong>${
                          movie.Writer
                        }</li>
                        <li class="list-group-item"><strong>Actors: </strong>${
                          movie.Actors
                        }</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="well">
                    <h3>Plot</h3>
                    ${movie.Plot}</hr>
                    <a href="http://imdb.com/title/${
                      movie.imdbID
                    }" class="btn btn-primary"> IMDB</a>
                    <a href="index.html" class="btn btn-danger"> Back</a>
                </div>
            </div>

            
             `;
          movieResult.innerHTML = output;
          footer.innerHTML = footerOutput;
        });
      sessionStorage.removeItem("movieImdbId");
    });
}

//       "https://api.themoviedb.org/3/movie/343611?api_key=98304107da83574cdac9140d458dce3d"

// "http://www.omdbapi.com/?i=tt0944947&apikey=bb4308b8"
