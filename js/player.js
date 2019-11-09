/*  PLAYER class
--------------------------*/
class Player {
  constructor() {
    this.state = '';          // loading | playing | paused | dead | ended
    this.cover = '';          // cover to disk
    this.view = null;         // DOM element
    
    this.currentTime = 0;     // track current pos
    this.volume = 0;        
    this.stream = null;       // current stream

    this.lastCoverPos = 0;    // last cover angule
    this.lastAxisPos = 0;     // last axis angule
    this.rotateId = 0;        // id of rotate intervale

    this.barId = 0;           // id of bar interval refresh
    this.barPosPercent = 0;   // current bar percent
    this.duration = 0;        // track duration in ms.
  }

  newPlayer = track => {
    document.getElementById('disk').setAttribute('style', `background-image:url('./img/disk.png')`);
    this.cover = track.cover;
    this.view = document.getElementById('cover').setAttribute('style', `background-image:url('${this.cover}')`);

    this.duration = track.duration;
    this.currentTime = 0;

    this.stream = SC.stream(`/tracks/${track.track}`);

    // we subscribe to player state change
    this.stream.then(player => player.on('state-change', (e) => {
      this.state = e;

      switch (e) {
        case 'loading':
        case 'playing':
          this.rotateStart();
          this.barPositionStart();
          break;
        case 'paused':
          this.rotateStop();
          this.barPositionStop();
          break;
        case 'dead':
        case 'ended':
          this.rotateStop();
          this.barPositionStop();
          this.stream = null;
          break;
        default:
          break;
      }
    }));
  };

  play = () => this.stream.then(player => player.play());
  pause = () => this.stream.then(player => player.pause());
  kill = () => this.stream.then(player => player.kill());

  getCurrentTime = () => this.stream.then(player => {
    this.currentTime = player.currentTime();
    return this.currentTime;
  });

  getDuration = () => this.stream.then(player => {
    this.duration = player.getDuration();
    return this.duration;
  });

  getVolume = () => this.stream.then(player => {
    this.volume = player.getVolume();
    return this.volume;
  });

  setVolume = (vol) => this.stream.then(player => {
    player.setVolume(vol);
    this.volume = vol;
    return this.volume;
  });

  setPosition = (pos) => this.stream.then(player => {
    player.seek(pos);
  });

  // rotate DISK control
  rotateCover = (angle) => {
    this.lastCoverPos = angle;
    this.lastAxisPos = 0;

    return setInterval(() => {
      if (this.lastCoverPos == 360) {
        this.lastCoverPos = 0;
        this.lastAxisPos = 0;
      } else {
        this.lastCoverPos++;
        this.lastAxisPos--;
      }

      document.getElementById("cover").style.transform = `rotate(${this.lastCoverPos}deg)`;
      document.getElementById("axis").style.transform = `rotate(${this.lastAxisPos}deg)`;
    }, 6);
  }

  rotateStart = () => {
    (this.rotateId) ? this.rotateStop() : null
    this.rotateId = this.rotateCover(this.lastCoverPos);
  }

  rotateStop = () => clearInterval(this.rotateId);

  // BAR TIME control
  setBarPosition = (posMs) => {
    if (player.stream) {
      this.currentTime = posMs;
      this.barPosPercent = (posMs * 100) / player.duration;
      this.barPosPercent = (this.barPosPercent >= 99) ? 100 : this.barPosPercent;

      document.getElementById('currentTime').innerHTML = getMinSec(posMs);
      document.getElementById('durationTime').innerHTML = getMinSec(this.duration);
      document.getElementById('barTime').setAttribute('style', `background-size: ${this.barPosPercent}% 29px`);
    }
  };

  autoRefreshBar = () => {
    return setInterval(() => {
      this.getCurrentTime();
      this.setBarPosition(this.currentTime);
    }, 1000);
  }

  barPositionStart = () => this.barId = this.autoRefreshBar();
  barPositionStop = () => clearInterval(this.barId);
}

/*  TRACK class
--------------------------*/
class Track {
  constructor(id, artist, title, track, duration, cover, release_year) {
    this.id = id;
    this.artist = artist;
    this.title = title;
    this.track = track;
    this.duration = duration;
    this.cover = (cover) ? cover : './img/noCover.png';
    this.release_year = (release_year) ? release_year : '-';
    this.listView = null;
  }
}