import React, { Component } from 'react';
import axios from 'axios';
import SearchBar from '../searchBar/searchBar.jsx';
import Results from '../results/results';
import './home.css'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      steamGameData: {},
      gogGameData: {},
      similarTitlesSteam: [],
      similarTitlesGog: [],
      money: false,
      searched: false,
      animationFin: false
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.handleTitleClick = this.handleTitleClick.bind(this)
    this.handleBackClick = this.handleBackClick.bind(this)
  }

  async handleSearch(event, query) {
    this.setState({
      steamGameData: {},
      gogGameData: {},
      similarTitlesSteam: [],
      similarTitlesGog: [],
      money: true,
      searched: false
    })
    event.preventDefault()
    query.trim()
    let steamAppId
    let gogData

    setTimeout(() => {
      this.setState({
        animationFin: true,
        money: false,
      })
    }, 4000);

    try {
      steamAppId = await axios.get(
        process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/steamgame/name/${query}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
      gogData = await axios.get(
        process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/goggame/${query}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }
    catch (error) {
      this.setState({
        searched: true,
      })
      return null;
    }

    if (steamAppId.data.length > 1) {
      this.setState({ similarTitlesSteam: steamAppId.data })
    } else if (steamAppId.data.length === 1) {
      const steamGame = await axios.get(process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/steamgame/appid/${steamAppId.data[0].appid}`)
      this.setState({
        steamGameData: this.formatSteamData(steamGame.data[steamAppId.data[0].appid].data)
      })
    }

    if (gogData.data.products.length > 1) {
      this.setState({
        similarTitlesGog: gogData.data.products.map(game => this.formatGogData(game))
      })
    } else if (gogData.data.products.length === 1) {
      this.setState({
        gogGameData: this.formatGogData(gogData.data.products[0])
      })
    }

    this.setState({
      searched: true,
    })

  }

  async formatSteamData(gameData) {
    let steamData = await axios.get(process.env.REACT_APP_SERVER_URL + `/api/v1.0.0/steamgame/appid/${gameData.appid}`)
    steamData = steamData.data[gameData.appid].data
    let resultObj
    if (gameData.appid && steamData) {
      resultObj = {
        id: steamData.steam_appid,
        price: steamData.is_free ? 'Free' : steamData.price_overview.final_formatted + '',
        name: steamData.name
      }
    } else {
      resultObj = {
        id: 'noId',
        price: 'Unavailable',
        name: gameData.name
      }
    }
    return resultObj
  }

  formatGogData(gameData) {
    const resultObj = {
      id: gameData.id,
      price: gameData.price.isFree ? 'Free' : gameData.price.symbol + '' + gameData.price.finalAmount,
      name: gameData.title
    }
    return resultObj
  }

  async handleTitleClick(platform, game) {
    if (platform === 'Steam') {
      const steamData = await this.formatSteamData(game)
      this.setState({
        similarTitlesSteam: [],
        steamGameData: steamData
      })
    } else if (platform === 'Gog') {
      this.setState({
        similarTitlesGog: [],
        gogGameData: game
      })
    }
  }

  handleBackClick() {
    this.setState({
      steamGameData: {},
      gogGameData: {},
      similarTitlesSteam: [],
      similarTitlesGog: [],
      money: false,
      searched: false,
      animationFin: false
    })
  }

  render() {
    const SearchResults = (
      <div className='resultPageWrapper'>
        <div className='backArrowSearch' onClick={this.handleBackClick}>
          Go Back
        </div>
        <div className='resultsPageResults'>
          <Results platform="Steam" handleTitleClick={this.handleTitleClick} gameData={this.state.similarTitlesSteam.length > 1 ? this.state.similarTitlesSteam : [this.state.steamGameData]} />
          <Results platform="Gog" handleTitleClick={this.handleTitleClick} gameData={this.state.similarTitlesGog.length > 1 ? this.state.similarTitlesGog : [this.state.gogGameData]} />
        </div>
      </div>
    )

    const searchPage = (
      <div className='searchbar'>
        <SearchBar handleSearch={this.handleSearch} />
      </div>
    )

    return (
      <div className='home'>
        <div className='titleTriangle' />
        <div className='title'>
          Game-O-Matic
        </div>
        <div className={this.state.money ? 'animatedMoneyWrapper' : 'hide'}>
          <img className={this.state.money ? 'animatedMoney' : 'hide'} src={`${process.env.REACT_APP_SERVER_URL}/money.jpg`} />
        </div>
        {this.state.searched ? SearchResults : searchPage}
      </div>
    );
  }
}
