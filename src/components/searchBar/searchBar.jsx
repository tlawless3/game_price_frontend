import React, { Component } from 'react';
import './searchbar.css'

const SearchBar = (props) => {
  return (
    <div className='wrapper'>
      <form className='searchForm'>
        <input id='searchInput' type='text' />
        <button onClick={(event) => props.handleSearch(event, document.getElementById('searchInput').value)}>Search</button>
      </form>
    </div>
  );
}

export default SearchBar
