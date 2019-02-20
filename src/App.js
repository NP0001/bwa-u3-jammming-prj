import React, { Component } from 'react';
import './App.css';
import Spotify from './util/Spotify';

import Playlist from './components/Playlist/Playlist';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'Jerk Of The Century',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    } else {
      let newPlaylist = this.state.playlistTracks.slice();
      newPlaylist.push(track);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  removeTrack(track){
    let changedPlaylist = this.state.playlistTracks.filter(removedTrack => removedTrack.id !== track.id);
    this.setState({playlistTracks: changedPlaylist});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    let trackURIs = [];
    //populate the list
    for (let i = 0; i < this.state.playlistTracks.length; i++){
      trackURIs.push(this.state.playlistTracks[i].uri)
    }

    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist'});
    this.setState({success: true});
  }

  search(searchTerm){
    console.log(`Searching ${searchTerm}`);
    Spotify.search(searchTerm).then(track => {
      this.setState({searchResults: track})
    });
  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar onSearch={this.search}/>
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
              <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
