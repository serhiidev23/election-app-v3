import { IonRow, IonCol, IonButtons, IonTitle, IonToolbar, IonGrid, IonButton } from '@ionic/react';
import './index.css';
import React, { useState, useEffect } from 'react';
import MapView from '../MapView';
import { useSelector } from 'react-redux';
import { dataSelector } from '../../slices/dataSlice';

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/pagination';
import TableView from '../TableView';

const ContentView: React.FC<{year: any, type: string, region: any, availability: any, setGranularity: any}> = ({year, type, region, availability, setGranularity}) => {
	const [state, setState] = useState({
		mapMode: true,
		sidebarDisabled: false,
		loaded: false
	})
	const [boundary, setBoundary] = useState<string>('');
	const selector = useSelector(dataSelector);

	// console.log('contentview')

	const getMapMode = (mode: any, _region?: any) => {
    if (_region === 'constituency' || _region === 'ward' || _region === 'polling_centre') {
			return false;
		}
		else {
			return mode;
		}
  }

	const handleMapMode = (mode: any, _region?: any) => {
		setState({
			...state,
			mapMode: getMapMode(mode, _region)
		})
	}

  const getResultRegion = (region: String) => {
		let results = "";
    switch (region) {
      case "nation":
		results = "National Results";
        break;
      case "region":
		results = "Results By Region";
        break;
      case "district":
		results = "Results By District";
        break;
      case "constituency":
		results = "Results By Constituency";
        break;
      case "ward":
		results = "Result By Ward";
        break;
      case "polling_centre":
		results = "Result By Polling Centre";
        break;
      default:
        break;
    }
	return results;
  }

  const handleInitialize = () => {
		setState({
			mapMode: getMapMode(true, availability.region),
			sidebarDisabled: type !== 'president'? true: false,
			loaded: true
		})
  }

  useEffect(() => {
		if (Object.keys(selector.whole_results).length > 0) {
			handleInitialize();
		}
  }, [selector.whole_results, type])
	
  return (
	<IonGrid className='content-view'>
		{Object.keys(selector.whole_results).length > 0 && <IonRow>
			{!state.sidebarDisabled && <IonCol className="granularity-list show-core ion-col-4">
				{region !== 'nation' && availability.nationAvailable && <a onClick={() => setGranularity('nation')}>
					<div className="senate">
						<div className="box">
							<h2>National Results</h2>
							<div className="box-content">
								<img src="assets/imgs/map.png" />
							</div>
						</div>
					</div>
				</a>}
				{region !== 'region' && availability.regionAvailable && <a onClick={() => setGranularity('region')}>
					<div className="senate">
						<div className="box">
							<h2>Results by region</h2>
							<div className="box-content">
								<img src="assets/imgs/map.png" />
							</div>
						</div>
					</div>
				</a>}
				{region !== 'district' && availability.districtAvailable && <a onClick={() => setGranularity('district')}>
					<div className="senate">
						<div className="box">
							<h2>Results by district</h2>
							<div className="box-content">
								<img src="assets/imgs/map.png" />
							</div>
						</div>
					</div>
				</a>}
				{region !== 'constituency' && availability.constituencyAvailable && <a onClick={() => setGranularity('constituency')}>
					<div className="senate">
						<div className="box">
							<h2>Results by constituency</h2>
							<div className="box-content">
								<img src="assets/imgs/map.png" />
							</div>
						</div>
					</div>
				</a>}
				{region !== 'ward' && availability.wardAvailable && <a onClick={() => setGranularity('ward')}>
					<div className="senate">
						<div className="box">
							<h2>Results by ward</h2>
							<div className="box-content">
								<img src="assets/imgs/map.png" />
							</div>
						</div>
					</div>
				</a>}
				{region !== 'polling_centre' && availability.pollingCentreAvailable && <a onClick={() => setGranularity('polling_centre')}>
					<div className="senate">
						<div className="box">
							<h2>Results by Polling Centre</h2>
							<div className="box-content">
								<img src="assets/imgs/map.png" />
							</div>
						</div>
					</div>
				</a>}
			</IonCol>}
			<IonCol className={`content ${type == 'president'? 'ion-col-8': ''} ${state.sidebarDisabled? '': 'fullWidth'}`}>
				<IonToolbar className="viewModeToolbar">
					<IonButtons slot='start'>
						<IonButton onClick={() => handleMapMode(true, region)} className={`modeButton ion-float-left ${state.mapMode? 'active': ''}`}>
							Map&nbsp;<i className="fa fa-globe"></i>
						</IonButton>
					</IonButtons>
					<IonTitle className='ion-text-center'>{ String(getResultRegion(region)) }</IonTitle>
					<IonButtons slot='end'>
						<IonButton onClick={() => handleMapMode(false, region)} className={`modeButton ${!state.mapMode? 'active': ''}`}>
							<i className="fa fa-table"></i>&nbsp;Table
						</IonButton>
					</IonButtons>
				</IonToolbar>
				{!state.mapMode && <TableView year={year} region={region} type={type} boundary={boundary} ></TableView>}
				{state.mapMode && <MapView year={year} region={region} type={type} onChangeBoundary={(str: string) => setBoundary(str)} />}
			</IonCol>
		</IonRow>}
	</IonGrid>
  );
};

export default ContentView;
