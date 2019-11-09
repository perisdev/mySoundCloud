/* GLOBAL VARIABLEs */
let listTracks = [];
let player = new Player;

/* FUNCTIONs */
const createNodeList = (track) => {
  let node = `
  <div data-id="${track.id}" class="track" draggable="true" ondragstart="onDragStart(event);">
    <img src="${track.cover}" alt="" class="track_img" draggable="false">
    <p>${track.title}</p>
    <p>${track.artist}</p>
  </div>
  `;

  document.getElementById('list').innerHTML += node;
}

const createNodeDetail = (track) => {
  let node = `
  <img src="${track.cover}" alt="" class="dCover">
  <div class="artist">
  <p class="dt">Artist</p>
    <p class="dd">${track.artist}</p>
  </div>
  <div class="title">
    <p class="dt">Title</p>
    <p class="dd">${track.title}</p>
    </div>
  <div class="year">
  <p class="dt">Year</p>
  <p class="dd">${track.release_year}</p>
  </div> 
  `;

  document.getElementById('detail').innerHTML = node;
}

const addListTracksViews = () => {
  let tracks = document.getElementsByClassName('track');
  for (let i = 0; i < tracks.length; i++) {
    listTracks[i].listView = tracks[i];
  }
}

const resetLastSearch = () => {
  list.innerHTML = '';
  listTracks = [];
};

const search = (input) => {
  resetLastSearch();

  SC.get('/tracks', {
    q: input,
    limit: 30
  }).then(tracks => {
    for (let i = 0; i < tracks.length; i++) {
      listTracks.push(new Track(i, tracks[i].permalink, tracks[i].title, tracks[i].id, tracks[i].duration, tracks[i].artwork_url));
    }

    listTracks.map((item) => createNodeList(item));
    addListTracksViews();
  });
}

// milisecons to 'min:secs':  61000 -> '01:01'
const getMinSec = (timeMs) => {
  let minSec = moment.duration(timeMs);
  let min = (minSec.minutes() < 10) ? '0' + minSec.minutes() : minSec.minutes();
  let sec = (minSec.seconds() < 10) ? '0' + minSec.seconds() : minSec.seconds();
  return `${min}:${sec}`;
}

/** DRAG & DROP --------------------------------------*/
// do in the drag
const onDragStart = (e) => {
  e.dataTransfer.setData('text', e.target.dataset.id);
};

const onDragOver = (e) => {
  e.preventDefault();
};

// do in the drop
const onDrop = (e) => {
  e.preventDefault();

  const id = listTracks.findIndex((item) => item.id == e.dataTransfer.getData('text'));
  // e.dataTransfer.clearData();

  if (id >= 0) {
    createNodeDetail(listTracks[id]);

    player.newPlayer(listTracks[id]);
    player.play();

    listTracks[id].listView.remove();
  }
};

/* START - APP  
  ----------------------------------------------------------*/
$(document).ready(function () {

  SC.initialize({
    client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb',
  });


  /* LISTENERs
    --------------------------------------------------------- */
  let input = $('#search:text');

  input.keyup(e => (e.key === 'Enter' && input.val()) ? search(input.val()) : null);

  $('#btSearch').click(() => input.val() ? search(input.val()) : null);

  $('#btPlay').click(() => {
    if (player.state == 'paused')
      player.play();
    else if (player.state == 'playing' || player.state == 'loading')
      player.pause();
  });

  $('#btStart').click(() => {
    if (player.stream) {
      player.setPosition(0);
      player.setBarPosition(0);
    }
  });

  $('#barTime').click(e => {
    if (player.stream) {
      let bar = e.target;

      let diffPx = e.clientX - bar.offsetLeft;
      let barPercent = (diffPx * 100) / bar.offsetWidth;
      let trackMs = (player.duration * barPercent) / 100;

      player.setBarPosition(trackMs);
      player.setPosition(trackMs);
    }
  });

  // drag & drop events
  document.getElementById('detail').addEventListener('drop', (e) => onDrop(e));
  document.getElementById('detail').addEventListener('dragover', (e) => onDragOver(e));
  document.getElementById('disk').addEventListener('drop', (e) => onDrop(e));
  document.getElementById('disk').addEventListener('dragover', (e) => onDragOver(e));
});


/** IN VANILLA */

  // let input = document.getElementById('search');
  // let btSearch = document.getElementById('btSearch');

  // input.addEventListener('keyup', (e) => {
  //   if (e.key === 'Enter' && input.value)
  //     search(input.value);
  // });

  // btSearch.addEventListener('click', () => {
  //   if (input.value)
  //     search(input.value);
  // });

  // document.getElementById('btPlay').addEventListener('click', () => {
  //   if (player.state == 'paused')
  //     player.play();
  //   else if (player.state == 'playing' || player.state == 'loading')
  //     player.pause();
  // });

  // document.getElementById('btStart').addEventListener('click', () => {
  //   if (player.stream) {
  //     player.setPosition(0);
  //     player.setBarPosition(0);
  //   }
  // });

  // document.getElementById('barTime').addEventListener('click', (e) => {

  //   if (player.stream) {
  //     let bar = e.target;

  //     let diffPx = e.clientX - bar.offsetLeft;
  //     let barPercent = (diffPx * 100) / bar.offsetWidth;
  //     let trackMs = (player.duration * barPercent) / 100;

  //     player.setBarPosition(trackMs);
  //     player.setPosition(trackMs);
  //   }
  // });

