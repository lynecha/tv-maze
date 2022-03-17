"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const DEFAULT_IMG = "https://tinyurl.com/tv-missing";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

/** [show1 {id,name, },show2 {}] */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get("http://api.tvmaze.com/search/shows", { params: { q: term } });
  //console.log(response.data[0].show.image.medium);
  let showArr = response.data;
  let resultArr = [];
  showArr.map(show => {
    let showData = {};
    showData.id = show.show.id;
    showData.name = show.show.name;
    showData.summary = show.show.summary;
    if (!show.show.image) {
      showData.image = DEFAULT_IMG;
    } else {
      showData.image = show.show.image.medium;
  } resultArr.push(showData);
});
return resultArr;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
      $showsList.empty();
      for (let show of shows) {
        const $show = $(
          `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="Poop"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

        $showsList.append($show);
      }
    }


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
      const term = $("#searchForm-term").val();
      const shows = await getShowsByTerm(term);

      $episodesArea.hide();
      populateShows(shows);
    }

$searchForm.on("submit", async function (evt) {
      evt.preventDefault();
      await searchForShowAndDisplay();
    });


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
    let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    let episodeData = response.data;
    let episodes = [];
    episodeData.map( episode => {
      let episodeObj = {};
      episodeObj.id = episode.id;
      episodeObj.name = episode.name;
      episodeObj.season = episode.season;
      episodeObj.number = episode.number;
      episodes.push(episodeObj);
    })
    console.log(episodes);
    return episodes;
}

/** Write a clear docstring for this function... */
//loop over our episodes arr jquery style and have that create an element with
//all the info and append it to the dom
function populateEpisodes(episodes) {
  const $episodesList = $("#episodesList");
  for(let episode of episodes){
    let e = $("<li>").text(`${episode.name}(Season ${episode.season}, Number ${episode.number})`);
    $episodesList.append(e);
  }
  $episodesArea.show();
}

console.log("episode button", $showsList);
$showsList.on("click", "button", async function (evt) {
  evt.preventDefault();
  console.log(evt.target);
  let id = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);

});

