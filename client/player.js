const player = (trackURI, auth) => {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = auth;

    const player = new Spotify.Player({
      name: 'Stevie Nicks Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.8
    });

    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    player.addListener('player_state_changed', state => { console.log(state); });

    player.addListener('ready', ({ device_id }) => {
      player._options.id = device_id;
      console.log('Ready with Device ID', device_id);
      play({
          playerInstance: player,
          spotify_uri: trackURI,
        });
    });

    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    player.connect().then(success => {
      if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
      }
    })

    const play = ({
      spotify_uri,
      playerInstance: {
        _options: {
          getOAuthToken,
          id,
          name,
          volume
        }
      }
    }) => {
      getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [spotify_uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
        });
      });
    };
  };
};

export default player;
