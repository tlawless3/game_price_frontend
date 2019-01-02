import React, { Component } from 'react';
import axios from 'axios';
import SearchBar from '../searchBar/searchBar.jsx';

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      steamGameData: {},
      gogGameData: {},
      similarTitlesSteam: [],
      similarTitlesGog: [],
      searched: false
    }

    this.handleSearch = this.handleSearch.bind(this)
  }

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
      this.setState({ similarTitlesSteam: steamAppId.data })
    } else if (steamAppId.data.length === 1) {
      const steamGame = await axios.get(process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/steamgame/appid/${steamAppId.data[0].appid}`)
      this.setState({
        steamGameData: steamGame.data[steamAppId.data[0].appid].data
      })
    }

    if (gogData.data.products.length > 1) {
      this.setState({
        similarTitlesGog: gogData.data.products
      })
    } else if (gogData.data.products.length === 1) {
      this.setState({
        gogGameData: gogData.data.products[0]
      })
    }

    this.setState({
      searched: true
    })
  }

  render() {
    return (
      <div className="home">
        <SearchBar handleSearch={this.handleSearch} />
      </div>
    );
  }
}
