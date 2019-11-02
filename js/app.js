/* START - DECLARATIONs
  ----------------------------------------------------------*/

/* VARIABLEs */
let listTracks = [];
let playerTrack = null;
let currentStream = null;

/* CLASSEs */
class Track {
  constructor(artist, title, track, duration, cover) {
    this.artist = artist;
    this.title = title;
    this.track = track;
    this.duration = duration;
    this.cover = cover;
    this.views = {
      0: null,  // result list view
      1: {
        view: null,  // player view
        rotation: 0
      }
    };
  }
}

/* FUNCTIONs */
const createNodeList = (track) => {
  let node = (`
  <div class="track">
    <img src="${(track.cover) ? track.cover : './img/noCover.png'}" alt="" class="track_img">
    <p>${track.title}</p>
    <p>${track.artist}</p>
  </div>
  `);

  document.getElementById('list').innerHTML += node;
}

const resetLastSearch = () => {
  list.innerHTML = '';
  listTracks = [];
  playerTrack = null;
};

const search = (input) => {
  resetLastSearch();

  SC.get('/tracks', {
    q: input,
    limit: 30
  }).then(tracks => {
    for (let i = 0; i < tracks.length; i++) {
      listTracks.push(new Track(tracks[i].permalink, tracks[i].title, tracks[i].id, tracks[i].duration, tracks[i].artwork_url));
    }

    listTracks.map((item) => createNodeList(item));

    console.log(listTracks);
    console.log(tracks);
  });
}

/** myStream control --------------------------------------*/
const newStream = track => {
  let newStream = SC.stream(`/tracks/${track}`);
  newStream.then(player => player.on('state-change', (e) => {
    console.log(e);
  }));

  return newStream;
};

//currentStream = newStream('9436047');

//myStream.then(player => player.play());
//myStream.then(player => player.pause());
//myStream.then(player => player.kill());
//myStream.then(player => player.currentTime());
//myStream.then(player => player.getDuration());
//myStream.then(player => player.getState());
//myStream.then(player => player.getVolume());
//myStream.then(player => player.setVolume());

// SC.stream('/tracks/9436047')
//   .then(function (player) {
  //     player.play();
  //   });

/** ------------------------------------------------------ */
  
/*----------------------------------------------------------
  END - DECLARATIONs */


/* START - APP  
  ----------------------------------------------------------*/
SC.initialize({
  client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb',
  // redirect_uri: 'https://localhost:5500/'
});


/* LISTENERs
  --------------------------------------------------------- */
let input = document.getElementById('search');
let list = document.getElementById('list');

input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && input.value)
    search(input.value);
});

list.addEventListener('click', () => {
  if (input.value)
    search(input.value);
});



