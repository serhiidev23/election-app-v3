import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import './index.css';
import { arrowForwardOutline, arrowBackOutline } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperInterface } from 'swiper';
import React, { useState } from 'react';
import { Pagination } from 'swiper';
import { RouteComponentProps } from 'react-router-dom';

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/pagination';

const Splash: React.FC<RouteComponentProps> = (props) => {
  let [back, setBack] = useState('Skip');
  let [next, setNext] = useState('Next');
  let [swiperInstance, setSwiperInstance] = useState<SwiperInterface>();
  const onSkip = () => {
    if (swiperInstance) {
      var current_index = swiperInstance.activeIndex;
      if (current_index === 0)
        props.history.push('/president');
      else
        swiperInstance.slideTo(swiperInstance.activeIndex - 1, 500)
    }
  }

  const onStart = () => {
    if (swiperInstance) {
      var current_index = swiperInstance.activeIndex;
      if (current_index === 2)
        props.history.push('/president');
      else
        swiperInstance.slideTo(swiperInstance.activeIndex + 1, 500)
    }
  }

  const slideChanged = () => {
    var current_index = swiperInstance?.activeIndex;
    switch (current_index) {
      case 0:
        // code...
        setBack("Skip")
        setNext("Next");
        break;
      case 1:
        setBack("Back")
        setNext("Next");
        // code...
        break;
      case 2:
        setBack("Back")
        setNext("Start");
        // code...
        break;
    }
  }

  return (
    <IonPage className='page-splash'>
      <IonHeader >
        <IonToolbar color="dark">
          <div className='toolbar-inner'>
            <div className='ion-padding-left ion-float-left' onClick={onSkip} style={{zIndex: '100'}}>
              <IonIcon icon={arrowBackOutline} slot="start"></IonIcon> 
              { back }
            </div>
            <IonTitle className='ion-text-uppercase ion-text-center'>
              SLOEDP
            </IonTitle>
            <div className='ion-padding-right ion-float-right' onClick={onStart} style={{zIndex: '100'}}>
              { next }
              <IonIcon icon={arrowForwardOutline} slot="start"></IonIcon> 
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding'>
        <Swiper 
          onSwiper={(swiper) => setSwiperInstance(swiper)} 
          onSlideChange={slideChanged}  
          modules={[Pagination]} 
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <h4 className='text-center'>Thank you for choosing the SLOEDP Live Election Results App!</h4>
            <div className='text-center'><img src="assets/imgs/logo.png" width="35" /></div>
            <p className='text-center'>The Live and historical Sierra Leone Election Results App.</p>
            <p className='text-center'>Use this app to visualize Sierra Leone Election results</p>
          </SwiperSlide>
          <SwiperSlide>
            <ul>
              <li>Click the "Harmbuger Menu" in the top left corner to "Navigate the various screens of the app"</li>
              <li>Click the filter (...) located in the top right corner to "filter results by national, district, constituency, ward and polling centre"</li>
              <li>Click on the links or swipe left or right to view results for that election year</li>
              <li>Click on MAP button located in the top left below the election year to view results on a map</li>
            </ul>
          </SwiperSlide>
          <SwiperSlide>
            <ul>
              <li>Click the + symbol on the map to zoom into the map</li>
              <li>Click the - symbol on the map to zoom out of the map</li>
              <li>Click on Table button located in the top right below the election year to view results in table format</li>
              <li>Click on a candidate name or photo to view their profile</li>
              <li>Click on a political party name to view their profile</li>
            </ul>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Splash;
