import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classes from './OffersFeed.module.css';
import Seo from '../SEO/Seo';

const OffersFeed = () => {
  const foodplaces = useSelector((state) => state.places.foodplaces);
  const [filter, setFilter] = useState('All');

  const allOffers = useMemo(() => {
    const offers = [];
    foodplaces.forEach(place => {
      if (place.discounts && place.discounts.length > 0) {
        place.discounts.forEach(discountStr => {
          const parts = discountStr.split(' | ');
          // parts[0] = Code/Item, parts[1] = Value, parts[2] = Expiry (Optional)
          const isExpired = parts[2] ? new Date(parts[2]) < new Date() : false;
          
          offers.push({
            placeId: place.id,
            placeTitle: place.title,
            placeImage: place.images?.[0],
            code: parts[0],
            value: parts[1],
            expiry: parts[2] || 'No Expiry',
            isExpired,
            category: place.type?.[0] || 'General' // Assuming type is array
          });
        });
      }
    });
    return offers;
  }, [foodplaces]);

  const categories = ['All', ...new Set(allOffers.map(o => o.category))];

  const filteredOffers = allOffers.filter(o => 
    filter === 'All' || o.category === filter
  );

  return (
    <>
      <Seo
        title="Offers & deals"
        description="Browse current discounts and special offers from food places listed on Food Shops."
      />
    <div className={classes.feedContainer}>
      <header className={classes.hero}>
        <div className={classes.heroContent}>
          <span className={classes.badge}>Daily Specials</span>
          <h1 className={classes.title}>The Midnight <br/><span className={classes.highlight}>Feast Curation</span></h1>
          <p className={classes.subtitle}>Hand-picked exclusive deals for tonight. Discover culinary masterpieces from our top-rated partners.</p>
        </div>
        <div className={classes.heroOverlay}></div>
      </header>

      <div className={classes.filterBar}>
        <div className={classes.filterInner}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={filter === cat ? classes.activeFilter : classes.filterBtn}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={classes.grid}>
        {filteredOffers.map((offer, i) => (
          <div key={i} className={`${classes.card} ${offer.isExpired ? classes.expired : ''}`}>
            <div className={classes.imageWrapper}>
              <img src={offer.placeImage} alt={offer.placeTitle} />
              <div className={classes.discountBadge}>{offer.value}</div>
            </div>
            <div className={classes.cardContent}>
              <div className={classes.cardHeader}>
                <span className={classes.placeName}>{offer.placeTitle}</span>
              </div>
              <h3 className={classes.offerTitle}>{offer.code}</h3>
              <p className={classes.expiryText}>
                {offer.isExpired ? 'Expired' : `Expires: ${offer.expiry}`}
              </p>
              <div className={classes.cardFooter}>
                <Link to={`/details/${offer.placeId}`} className={classes.claimBtn}>
                  {offer.isExpired ? 'View Shop' : 'Claim Now'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default OffersFeed;
