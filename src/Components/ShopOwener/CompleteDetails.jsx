import React, { useEffect, useMemo } from "react";
import { Skeleton, Button, Space } from "antd";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RWebShare } from "react-web-share";
import { getFoodShopById } from "../../store/placesSlice";
import MapComponent from "../Maps/MapComponent";
import classes from "./CompleteDetails.module.css";

import foodPlaceClasses from '../Home/FoodPlace.module.css';
import Seo from "../SEO/Seo";
import { DEFAULT_DESCRIPTION } from "../../seo/constants";

const CompleteDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { foodplace: data, isLoading } = useSelector((state) => state.places);

  useEffect(() => {
    dispatch(getFoodShopById({ id }));
  }, [id, dispatch]);


  const mainImage = data.images && data.images.length > 0 ? data.images[0] : (data.image ?? '');

  const formattedType = Array.isArray(data.type)
    ? [...new Set(data.type.filter(t => typeof t === 'string' && t.trim() !== ''))].join(', ')
    : data.type;

  const metaDescription = useMemo(() => {
    const parts = [data.description, data.speciality, data.location].filter(Boolean);
    const text = parts.join(" · ") || DEFAULT_DESCRIPTION;
    return text.length > 160 ? `${text.slice(0, 157)}…` : text;
  }, [data.description, data.speciality, data.location]);

  const jsonLd = useMemo(() => {
    const images = (data.images?.length ? data.images : [mainImage]).filter(Boolean);
    const node = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: data.title,
      image: images,
      description: data.description || undefined,
      telephone: data.contact || undefined,
    };
    if (data.location) {
      node.address = {
        "@type": "PostalAddress",
        streetAddress: String(data.location),
      };
    }
    if (data.speciality) {
      node.servesCuisine = String(data.speciality);
    }
    return node;
  }, [data, mainImage]);

  return (
    <div className={classes.detailsPage}>
      <Seo
        title={data.title}
        description={metaDescription}
        image={mainImage}
        type="article"
        jsonLd={jsonLd}
      />
      <header className={classes.hero}>
        <div className={classes.heroImageWrapper}>
          <img src={mainImage} alt={data.title} className={classes.heroImage} />
          <div className={classes.imageOverlay} />
        </div>

        <div className={classes.heroTitleContainer}>
          <button className={classes.backBtn} onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className={classes.titleContent}>
            <div className={classes.categoryBadge}>{(() => {
              let types = [];
              if (Array.isArray(data.type)) types = data.type;
              else if (typeof data.type === 'string') {
                try {
                  const parsed = JSON.parse(data.type);
                  types = Array.isArray(parsed) ? parsed : [parsed];
                } catch {
                  types = [data.type];
                }
              }

              return types.map(t => {
                if (typeof t !== 'string') return null;
                const nt = t.toLowerCase().replace('-', ' ');
                if (nt.includes('non veg')) {
                  return <span key="non-veg" className={foodPlaceClasses.nonVegBadge}>Non-Veg</span>;
                }
                if (nt.includes('veg')) {
                  return <span key="veg" className={foodPlaceClasses.vegBadge}>Veg</span>;
                }
                return null;
              });
            })()}</div>
            <h1 className={classes.title}>{data.title}</h1>
            <div className={classes.meta}>
              {/* <div className={classes.metaItem}>
                <span className="material-symbols-outlined">star</span>
                <span>4.8 (120 reviews)</span>
              </div> */}
              <div className={classes.metaItem}>
                <span className="material-symbols-outlined">location_on</span>
                <span>{data.location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={classes.contentGrid}>
        <main className={classes.mainContent}>
          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>About this place</h2>
            <p className={classes.description}>{data.description}</p>
          </section>

          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Speciality</h2>
            <div className={classes.specialityCard}>
              <span className="material-symbols-outlined">restaurant_menu</span>
              <p>{data.speciality}</p>
            </div>
          </section>

          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Gallery</h2>
            <div className={classes.galleryContainer}>
              {
                data.images && data.images.length > 0 ? (
                  data.images.map((image, index) => (
                    <img key={index} src={image} alt={`gallery-${index}`} className={classes.galleryImage} />
                  ))
                ) : (
                  <p className={classes.noImages}>No images available</p>
                )
              }
            </div>
          </section>
        </main>

        <aside className={classes.sidebar}>
          <div className={classes.stickySidebar}>
            <div className={classes.actionCard}>
              <h3 className={classes.actionTitle}>Visit or Contact</h3>
              <p className={classes.actionSub}>Open now: 09:00 AM - 11:00 PM</p>

              <div className={classes.actionButtons}>

                <RWebShare
                  type="primary" size="large" block
                  data={{
                    text: `Check out ${data.title}`,
                    url: window.location.href,
                    title: data.title,
                  }}
                >
                  <Button type="primary" size="large" block>Share Place</Button>
                </RWebShare>
              </div>
            </div>

            <div className={classes.mapCard}>
              <h3 className={classes.actionTitle}>Find us here</h3>
              <div className={classes.miniMap}>
                <MapComponent
                  currentPosition={data.selectPosition || []}
                  mywidth="100%"
                  myheight="200px"
                  address={data.location}
                />
              </div>
              <p className={classes.addressText}>{data.location}</p>
            </div>
          </div>
        </aside>
      </div>

      <nav className={classes.bottomNav}>
        <Link to={`/comments/${id}`} className={classes.commentBtn}>
          <span className="material-symbols-outlined">chat_bubble</span>
          <span>Read {data.comments?.length || 0} Reviews</span>
        </Link>
      </nav>
    </div>
  );
};

export default CompleteDetails;
