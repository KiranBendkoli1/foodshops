import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlaces } from "../../store/placesSlice";
import FoodPlace from "./FoodPlace";
import HomeHero from "./HomeHero";
import classes from "./FoodPlaces.module.css";

const FoodPlaces = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const dispatch = useDispatch();
  const { foodplaces, isLoading } = useSelector((state) => state.places);

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  const filteredPlaces = useMemo(() => {
    return foodplaces.filter((place) => {
      const matchesSearch =
        (place.title?.toLowerCase().includes(search.toLowerCase()) ||
        place.location?.toLowerCase().includes(search.toLowerCase()) ||
        place.speciality?.toLowerCase().includes(search.toLowerCase())) ?? false;

      if (activeFilter === "All") return matchesSearch;

      // Normalize the type data which could be an array, a string, or stringified JSON
      let typeArray = [];
      if (Array.isArray(place.type)) {
        typeArray = place.type;
      } else if (typeof place.type === "string") {
        try {
          // Try to parse if it's stringified JSON like '["Veg"]'
          const parsed = JSON.parse(place.type);
          typeArray = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          // If not JSON, it's just a regular string
          typeArray = [place.type];
        }
      }

      const matchesFilter = typeArray.some((t) => {
        if (typeof t !== "string") return false;
        const normalizedT = t.trim().toLowerCase().replace("-", " ");
        const normalizedFilter = activeFilter.toLowerCase().replace("-", " ");
        return normalizedT === normalizedFilter;
      });

      return matchesSearch && matchesFilter;
    });
  }, [foodplaces, search, activeFilter]);

  return (
    <div className={classes.container}>
      <HomeHero onSearch={setSearch} />
      
      <div className={classes.discoveryHeader}>
        <h2 className={classes.sectionTitle}>Discover culinary gems</h2>
        <div className={classes.filterBadges}>
          <button 
            className={activeFilter === "All" ? classes.activeBadge : classes.badge}
            onClick={() => setActiveFilter("All")}
          >
            All
          </button>
          <button 
            className={activeFilter === "Veg" ? classes.activeBadge : classes.badge}
            onClick={() => setActiveFilter("Veg")}
          >
            Veg
          </button>
          <button 
            className={activeFilter === "Non Veg" ? classes.activeBadge : classes.badge}
            onClick={() => setActiveFilter("Non Veg")}
          >
            Non Veg
          </button>
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
           <p>No culinary gems found for {search ? `"${search}"` : 'your search'}</p>
        </div>
      )}
    </div>
  );
};

export default FoodPlaces;
