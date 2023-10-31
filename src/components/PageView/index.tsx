import React, { useRef, useState } from 'react';
import { IonContent, IonButton, IonButtons, IonPage, IonTitle, IonToolbar, IonIcon, useIonViewDidEnter, useIonLoading } from '@ionic/react';
import './index.css';
import HeaderView from '../../components/HeaderView';
import { arrowForwardOutline, arrowBackOutline } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperInterface } from 'swiper';
import { Pagination } from 'swiper';
import { useSelector, useDispatch } from 'react-redux';
import { dataSelector, setYear, setWholeResults } from '../../slices/dataSlice';
import { useAvailability } from '../../hooks/useAvailability';
import axios from 'axios';

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/pagination';
import ContentView from '../../components/ContentView';

let whole_results: any = null;
const PresidentPage: React.FC<{title: string, type: string}> = ({title, type}) => {
  const firstRef = useRef<any>();
  const [state, setState] = useState<{
    prevYear: number,
    nextYear: number,
    prevEnabled: boolean,
    nextEnabled: boolean,
  }>({
    prevYear: 0,
    nextYear: 0,
    prevEnabled: false,
    nextEnabled: false,
  });
  const dispatch = useDispatch();
  let subpages: Array<{year: Number}> = [
    { year: 1996},
    { year: 2002},
    { year: 2007},
    { year: 2012},
    { year: 2018},
    { year: 2023},
  ];
  let totalPages = subpages.length;
  let [swiperInstance, setSwiperInstance] = useState<SwiperInterface>();
  const selector = useSelector(dataSelector);
  const [present, dismiss] = useIonLoading();
  const year_ = selector.year;
  const [availability, setGranularity] = useAvailability(type, selector.year);
  const region = availability.region;
  console.log('pageview')

  const setPageInfo = () => {
    dispatch(setYear(subpages[totalPages - 1].year));

    if (totalPages > 1) {
      setState({
        ...state,
        prevEnabled: true,
        prevYear: Number(subpages[totalPages - 2].year),
      })
    }

    let initialSlide:any = totalPages > 1 ? totalPages - 1 : 0;
    if (swiperInstance) {
      swiperInstance.slideTo(initialSlide, 500);
    }
  }

  const setPrevPage = () => {
    if (swiperInstance) {
      swiperInstance.slideTo(swiperInstance.activeIndex - 1, 500);
    }
  }

  const setNextPage = () => {
    if (swiperInstance) {
      swiperInstance.slideTo(swiperInstance.activeIndex + 1, 500);
    }
  }

  const slideChanged = () => {
    if (swiperInstance) {
      let currentIndex = swiperInstance.activeIndex;
      if (!totalPages || currentIndex == totalPages || totalPages === 0) return;

      setState({
        ...state,
        prevEnabled: !swiperInstance.isBeginning && currentIndex > 0,
        nextEnabled: !swiperInstance.isEnd && currentIndex < (totalPages - 1),
        prevYear: Number(!swiperInstance.isBeginning && currentIndex > 0? subpages[currentIndex - 1].year : 0),
        nextYear: Number(!swiperInstance.isEnd && (currentIndex < totalPages-1)? subpages[currentIndex + 1].year : 0),
      })

      setSlideChanges(subpages[currentIndex].year);
    }
  }

  const setSlideChanges = (year: any) => {
    if (swiperInstance) {
      let currentIndex = swiperInstance.activeIndex;
      if (!totalPages || currentIndex == totalPages || totalPages === 0) return;
      dispatch(setYear(year));
    }
  }

  useIonViewDidEnter(() => {
    if (swiperInstance && firstRef.current && !whole_results) {
      console.log('loading')
      present({
        message: 'Loading data...',
        duration: 1000
      });

      axios.get('http://localhost:5000/election_results').then((response: any) => {
        whole_results = response.data
        dispatch(setWholeResults(whole_results));
        dismiss();
      });
    }
    setPageInfo();
  }, [swiperInstance]);

  return (
    <IonPage id="content">
      <HeaderView type="president" availability={availability} setGranularity={setGranularity}>
        <IonToolbar color="dark" className='sub-nav'>
          {state.prevEnabled && 
            <IonButtons slot="start">
              <IonButton className='ion-float-left' onClick={setPrevPage} style={{ zIndex: 200}}>
                <IonIcon icon={arrowBackOutline} slot="start"></IonIcon> {String(state.prevYear)}
              </IonButton>
            </IonButtons>}

          <IonTitle>
            { String(year_) } {title}
          </IonTitle>

          {state.nextEnabled && 
            <IonButtons slot="end">
              <IonButton className='ion-float-right' onClick={setNextPage} style={{ zIndex: 200}}>
                <div>{String(state.nextYear)}</div> <IonIcon icon={arrowForwardOutline} slot="start"></IonIcon> 
              </IonButton>
            </IonButtons>}
        </IonToolbar>
      </HeaderView>
      <IonContent className='ion-padding' >
       <Swiper 
          onSwiper={(swiper) => setSwiperInstance(swiper)} 
          onSlideChange={slideChanged}  
          // modules={[Pagination]} 
          // pagination={{ clickable: true }}
          ref={firstRef}
        >
          {subpages.map((subpage, index) =>
            (<SwiperSlide key={'contentview_' + index}>
              {selector.whole_results.chairperson && region && 
                <ContentView 
                  type={type} 
                  year={subpage.year} 
                  region={region} 
                  availability={availability} 
                  setGranularity={setGranularity}
                />}
            </SwiperSlide>)
          )}
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default PresidentPage;
