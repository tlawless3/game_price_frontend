import React, { Component } from 'react';
import axios from 'axios';
import SearchBar from '../searchBar/searchBar.jsx';

export default class Home extends Component {

  async handleSearch(event, query) {
    event.preventDefault()
    query.trim()
    const nameResult = await axios.get(
      process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/steamgame/name/${query}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
    console.log(nameResult)
  }

  render() {
    return (
      <div className="home">
        <SearchBar handleSearch={this.handleSearch} />
      </div>
    );
  }
}
