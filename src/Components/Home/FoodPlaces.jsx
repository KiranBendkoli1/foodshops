import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlaces } from "../../store/placesSlice";
import FoodPlace from "./FoodPlace";
import HomeHero from "./HomeHero";
import classes from "./FoodPlaces.module.css";

const FoodPlaces = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { foodplaces, isLoading } = useSelector((state) => state.places);

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  const filteredPlaces = useMemo(() => {
    return foodplaces.filter(
      (place) =>
        place.title.toLowerCase().includes(search.toLowerCase()) ||
        place.location.toLowerCase().includes(search.toLowerCase()) ||
        place.speciality.toLowerCase().includes(search.toLowerCase())
    );
  }, [foodplaces, search]);

  return (
    <div className={classes.container}>
      <HomeHero onSearch={setSearch} />
      
      <div className={classes.discoveryHeader}>
        <h2 className={classes.sectionTitle}>Discover culinary gems</h2>
        <div className={classes.filterBadges}>
          <button className={classes.activeBadge}>All Cuisines</button>
          <button className={classes.badge}>Japanese</button>
          <button className={classes.badge}>Italian</button>
          <button className={classes.badge}>Vegan</button>
        </div>
      </div>

      {isLoading ? (
        <div className={classes.loader}>Discovering the best places for you...</div>
      ) : (
        <div className={classes.grid}>
          {filteredPlaces.map((place, index) => (
            <FoodPlace key={place.id} foodplace={place} index={index} />
          ))}
        </div>
      )}

      {filteredPlaces.length === 0 && !isLoading && (
        <div className={classes.noResults}>
           <span className="material-symbols-outlined">search_off</span>
           <p>No culinary gems found for "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default FoodPlaces;
