import React, { Component } from 'react';
import axios from 'axios';
import SearchBar from '../searchBar/searchBar.jsx';

export default class Home extends Component {

  async handleSearch(event, query) {
    event.preventDefault()
    query.trim()
    const steamAppId = await axios.get(
      process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/steamgame/name/${query}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
    const gogData = await axios.get(
      process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/goggame/${query}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
    if (steamAppId.data.length > 1) {
      console.log(steamAppId.data)
    }
    if (gogData.data.products.length > 1) {
      console.log(gogData.data.products)
    }
  }

  render() {
    return (
      <div className="home">
        <SearchBar handleSearch={this.handleSearch} />
      </div>
    );
  }
}
