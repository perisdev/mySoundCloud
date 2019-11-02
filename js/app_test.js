
const search = (input) => {
  return {
    q: input
  };
}

SC.initialize({
  client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb',
  // redirect_uri: 'https://localhost:5500/'
});

SC.get('/tracks', search('the cult')).then(tracks => {
  console.log(tracks);
});

// var track_url = 'https://soundcloud.com/forss/flickermood';
// SC.oEmbed(track_url, { auto_play: true }).then(function(oEmbed) {
//   console.log('oEmbed response: ', oEmbed);
// });

// SC.oEmbed('https://api.soundcloud.com/tracks/523983363', {
//   element: document.getElementById('widget'),
//   autoplay: true,
// });




// stream track id 293
// SC.stream('/tracks/293').then(function(player){
//   player.play().then(function(){
//     console.log('Playback started!');
//   }).catch(function(e){
//     console.error('Playback rejected. Try calling play() from a user interaction.', e);
//   });
// });

SC.stream('/tracks/293').then(function(player){
  //player.play();
});