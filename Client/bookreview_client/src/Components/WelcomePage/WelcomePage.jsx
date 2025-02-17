import NavBar from "../NavBar/NavBar";
import SearchForm from "../SearchForm/SearchForm";
import React from 'react';
import './WelcomePage.css';

const WelcomePage = () => {

  return (
    <main>
      <NavBar />
      <div className='wp-content flex flex-c text-center text-white'>
        <h2 className='wp-title text-capitalize'>Your Gateway to Great Reads</h2><br />
        <p className='wp-text fs-18 fw-3'>BookNest is your go-to platform for discovering, reviewing, and recommending books. Whether you're searching for your next great read or sharing your thoughts on a recent favorite, our community-driven reviews and personalized recommendations help you make the best choices. Start exploring today!</p>
        <SearchForm />
      </div>
    </main>
  );
};

export default WelcomePage;
