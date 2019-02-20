const clientID = '15e8c246343d416f9e28b4bee769ed6a';
const redirectURI = 'http://localhost:3000/'
let accessToken;
const Spotify = {

  search(term) {
    accessToken = Spotify.getAccessToken();
    console.log('token: ' + accessToken);
       //API call to the search endpoint to get the result and return an array
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
   }).then(response =>{
        return response.json();
   }).then(jsonResponse => {
        if (jsonResponse) {
                 //return the array of tracks from the jsonresponse
            return jsonResponse.tracks.items.map(track =>({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        }
      }, networkError => console.log(networkError.message));
   },


  getAccessToken(){
    if(accessToken){
      return accessToken;
    }
    if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)){
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      let expiresIn= window.location.href.match(/expires_in=([^&]*)/);

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    else{
      let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = url;
    }
  },

  savePlaylist(playlistName, trackURIs){
    accessToken = Spotify.getAccessToken();
    let headers = {Authorization: `Bearer: ${accessToken}`};
    let userID;
    let playlistID;

        if(!playlistName && trackURIs === 0){
            return;
        }
        //Generate user ID
        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(response => response.json()).then(jsonResponse =>{
            console.log(jsonResponse.id);
            userID = jsonResponse.id;
        //POST request to create new playlist with playlist name and get a playlist ID then saves the playlist ID
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/jsonResponse'
                },
                body: JSON.stringify({
                    name: playlistName
                })
            }).then(response => response.json()).then(jsonResponse => {
                console.log(jsonResponse);
                playlistID = jsonResponse.id
        //POST request to add the tracks to the playlist


                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    method: 'POST',
                    headers:{
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/jsonResponse'
                    },
                    body: JSON.stringify({
                        uris: trackURIs
                    })
                }).then(response => response.json().then(jsonResponse => {
                    // console.log("Jsonresponse", response.json)
                    playlistID = jsonResponse.id; //Not sure why we have to save the playlistID again? It's in the instructions.
                }));
            });
        }, networkError => console.log(networkError.message));
    }
};



export default Spotify;
