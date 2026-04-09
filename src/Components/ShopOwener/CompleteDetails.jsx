import React, { useEffect } from "react";
import { Skeleton, Button, Space } from "antd";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RWebShare } from "react-web-share";
import { getFoodShopById } from "../../store/placesSlice";
import ImageCarousel from "../UI/ImageCarousel";
import MapComponent from "../Maps/MapComponent";
import classes from "./CompleteDetails.module.css";

const CompleteDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { foodplace: data, isLoading } = useSelector((state) => state.places);

  useEffect(() => {
    dispatch(getFoodShopById({ id }));
  }, [id, dispatch]);

  if (isLoading || !data) {
    return (
      <div className={classes.loading}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  const mainImage = data.images && data.images.length > 0 ? data.images[0] : (data.image || 'https://via.placeholder.com/800x400');

  return (
    <div className={classes.detailsPage}>
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
            <div className={classes.categoryBadge}>{data.type}</div>
            <h1 className={classes.title}>{data.title}</h1>
            <div className={classes.meta}>
               <div className={classes.metaItem}>
                 <span className="material-symbols-outlined">star</span>
                 <span>4.8 (120 reviews)</span>
               </div>
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
               <ImageCarousel images={data.images || []} />
            </div>
          </section>
        </main>

        <aside className={classes.sidebar}>
          <div className={classes.stickySidebar}>
            <div className={classes.actionCard}>
              <h3 className={classes.actionTitle}>Visit or Contact</h3>
              <p className={classes.actionSub}>Open now: 09:00 AM - 11:00 PM</p>
              
              <div className={classes.actionButtons}>
                 <Button type="primary" size="large" block className={classes.primaryAction}>
                    Book a Table
                 </Button>
                 <RWebShare
                    data={{
                      text: `Check out ${data.title}`,
                      url: window.location.href,
                      title: data.title,
                    }}
                 >
                   <Button size="large" block>Share Place</Button>
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
