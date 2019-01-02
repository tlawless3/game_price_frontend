import React, { Component } from 'react';
import SearchBar from '../searchBar/searchBar.jsx';

export default class Home extends Component {

  handleSearch(event, query) {
    event.preventDefault()
    console.log(query)
  }

  render() {
    return (
      <div className="home">
        <SearchBar handleSearch={this.handleSearch} />
      </div>
    );
  }
}
