import React from 'react';
import classes from './HomeHero.module.css';

const HomeHero = ({ onSearch }) => {
  return (
    <section className={classes.hero}>
      <div className={classes.heroContent}>
        <h1 className={classes.title}>
          Discover <span className={classes.highlight}>Extraordinary</span> <br />
          Flavors Near You.
        </h1>
        <p className={classes.subtitle}>
          Your digital concierge for the finest dining experiences, curated for your specific palate.
        </p>
        <div className={classes.searchContainer}>
          <div className={classes.searchWrapper}>
             <i className="material-symbols-outlined">search</i>
             <input 
               type="text" 
               placeholder="Search cuisines, restaurants, or dishes..." 
               onChange={(e) => onSearch(e.target.value)}
               className={classes.searchInput}
             />
          </div>
          <button className={classes.searchButton}>Explore</button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
