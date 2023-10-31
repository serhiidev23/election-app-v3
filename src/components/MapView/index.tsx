import { icon, latLng } from 'leaflet';
import React, { useEffect, useState, useRef } from 'react';
import { IonGrid, IonToggle, useIonRouter, IonRow, IonCol, useIonLoading } from "@ionic/react";
import { useSelector, useDispatch } from 'react-redux';
import { dataSelector, setPollingCentresJson, setResults } from '../../slices/dataSlice';
import { loadResultsByFields } from '../../provider/data'

import nationGeoJSON from '../../assets/maps/nation.json'
import regionGeoJSON from '../../assets/maps/region.json'
import region2018GeoJSON from '../../assets/maps/region-2018.json'
import districtGeoJSON from '../../assets/maps/district.json'
import district2018GeoJSON from '../../assets/maps/district-2018.json'
import { MapContainer, TileLayer, Marker, GeoJSON, Popup, useMap } from 'react-leaflet';
import './index.css';

interface ContainerProps { year: number, region: string, type: string, onChangeBoundary: any}

const MapView: React.FC<ContainerProps> = ({year, region, type, onChangeBoundary}) => {
	const [round, setRound] = useState<boolean>(true);
	const [result, setResult] = useState<any>({
		'ResultStatus': "",
		'TotalVotes': "",
		'ValidVotes': "",
		'InvalidVotes': "",
		'VotesPecentage': "",
		'Parties': {},
		'Candidates': {},
		'Boundaries': {},
		'ElectionResults': []
	});
	const [layers, setLayers] = useState<any>();
	const [isRoundAvailable, setIsRoundAvailable] = useState<Boolean>();
	const [noWinner, setNoWinner] = useState<Boolean>(true);
	const router = useIonRouter();
	const selector = useSelector(dataSelector);
	const dispatch = useDispatch();
	const [present, dismiss] = useIonLoading();

  const mapOptions = {
		zoom: 7,
		center: latLng(8.460555,-11.779889)
	};
	let two_rounds = [1996, 2007, 2018];

	const applyMap = (layers_: any) => {
		layers_.push(<TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='Open Street Map'></TileLayer>);
		setLayers(layers_);
	}

	const gotoPartyDetail = (party: any) => {
		router.push(`/party/${party.Acronym}`, "forward", "push");
	}

	const gotoCandidateDetail = (candidate_id: any) => {
		router.push(`/candidate/${candidate_id}`, "forward", "push");
	}

	const candidatesEnable = () => {
		return result.ElectionResults.length > 0;
	}

	const transform2d = (value: any, columns: any, limit: any) : any => {
		let results = [];
		for (let i in value) {
			if (i >= limit) continue;
			if (Number(i) % columns == 0) {
				results.push([value[i]]);
			}
			else {
				results[results.length - 1].push(value[i]);
			}
		}

		return results;
	}

	const setPhotoUrl = (photo: any) => {
		return "assets/imgs/candidate/" + photo;
	}

	const colorFilter = (_color: any) => {
		var default_color = "#999";
		var colors = ["Pink", "Orange", "Green", "Red", "Blue", "Purple", "Yellow"];
		var color = _color.trim();
		if (!color) return default_color;
		if (color.split(',').length > 1) {
			return color.split(',')[0];
		}
		if (colors.indexOf(color.charAt(0).toUpperCase() + color.slice(1)) > -1) {
			return color;
		}
		return "#" + color;
	}

	const makeKey = (value: any) => {
		return value.toLowerCase().replace(/\ /gi, '_');
	}

	const makeBoundaryJson = (boundaries: any) => {
		var boundary_key;
		var boundary_json: any = {};
		boundaries.forEach(function(boundary: any) {
			boundary_key = makeKey(boundary.name)
			boundary_json[boundary_key] = boundary;
		})

		return boundary_json
	}

	const otherPercent = (candidates: any) => {
		return (100.0 - parseFloat(candidates[0].ValidVotesPercentage) - parseFloat(candidates[1].ValidVotesPercentage)).toFixed(2);
	}

	const getBoundaryColor = (boundary: any) => {
		var boundary_key = makeKey(boundary.name)
		return colorFilter(selector.boundary_json[boundary_key].candidates[0].CandidatePoliticalPartyColor)
	}

	const changeRound = () => {
		drawMap()
	}

	const drawMap = () => {
		let fields: any = {
			year: year,
			type: type,
			region: region
		}
		if (type === 'president' && two_rounds.indexOf(year) !== -1)
			fields['round'] = round ? 'second' : 'first';

		present({
			message: 'Loading data...',
			duration: 1000
		});

		const data = loadResultsByFields(selector, fields);
		dispatch(setPollingCentresJson(data.polling_centres_json));
		dispatch(setResults(data.results));

		let cur_result = { ...result };
		var Parties = data['Parties'];
		cur_result.Candidates = data['Candidates'];
		cur_result.Boundaries = data['Boundaries'];
		cur_result.TotalVotes = year === 2018 ? 3178664 : data['ValidVotes'];
		
		cur_result.InvalidVotes = year === 2018 ? 139427 : 0;
		cur_result.ResultStatus = "Final & Certified"
		
		cur_result.ElectionResults = [];
		
		let boundary_json: any = {};

		if (cur_result.Boundaries.length > 0) {
			boundary_json = makeBoundaryJson(cur_result.Boundaries)
			if (cur_result.Boundaries[0].candidates[0]['ValidVotes'] > 0) {
				setNoWinner(false);
				
				cur_result.ValidVotes = cur_result.Boundaries[0].votes;
				if (year === 2018)
					if (cur_result.TotalVotes == 0)
						cur_result.VotesPecentage = "0%"
					else
						cur_result.VotesPecentage = ((cur_result.ValidVotes / cur_result.TotalVotes) * 100).toFixed(2) + '%'
				else
					cur_result.VotesPecentage = "100%"
			}
			else {
				setNoWinner(true);
			}

			cur_result.ElectionResults = cur_result.Boundaries[0].candidates;
			onChangeBoundary(cur_result.Boundaries[0].name);
			cur_result.Parties = {};
			
			for (let candidate of cur_result.Boundaries[0].candidates) {
				cur_result.Parties[candidate['CandidatePoliticalParty']] = Parties[candidate['CandidatePoliticalParty']];
			}
		}

		if (region === "nation" || region === "region" || region === "district") {
			var geoData: any;
			if (region === 'nation') geoData = nationGeoJSON['features']
			if (region === 'region' && year !== 2018) geoData = regionGeoJSON['features']
			if (region === 'region' && year === 2018) geoData = region2018GeoJSON['features']
			if (region === 'district' && year !== 2018) geoData = districtGeoJSON['features']
			if (region === 'district' && year === 2018) geoData = district2018GeoJSON['features']
		
			setTimeout(() => {
				const geoJSONLayer = (<GeoJSON 
					data={geoData}
					onEachFeature = {(feature, layer) => {
						var boundary_key = makeKey(feature.properties.Name)
						var boundaryName = feature.properties.Name
						if (type == 'mayor' && boundary_json[boundary_key])
							boundaryName = boundary_json[boundary_key]['name_council']
						layer.bindPopup(boundaryName)
						
						layer.on('click', function() {
							var boundary_key = makeKey(feature.properties.Name)
							var boundary = boundary_json[boundary_key]
							applyResult(boundary)
						})
						if (region === 'region' && feature.properties.Name === 'West') {
							layer.fireEvent('click')
							setTimeout(function() {
								layer.openPopup()
							}, 10)
						}
						if (region === 'district' && feature.properties.Name === 'Western Area Urban') {
							layer.fireEvent('click')
							setTimeout(function() {
								layer.openPopup()
							}, 10)
						}
					}}
					style = {(feature: any) => {
						var boundary_key = makeKey(feature.properties.Name)
						if (boundary_json[boundary_key])
							return { color: colorFilter(boundary_json[boundary_key].candidates[0].CandidatePoliticalPartyColor) }
						else
							return { color: '#999' }
						
					}}
				/>);
	
				applyMap([geoJSONLayer]);
				dismiss();
			}, 50)
		}
		else {
			var markerBoundary;
			var layers = [];
			for(let boundary of cur_result.Boundaries) {
				markerBoundary = (<Marker 
					position={[boundary.latitude, boundary.longitude ]}
					icon={icon({
						iconSize: [ 25, 41 ],
						iconAnchor: [ 13, 41 ],
						iconUrl: '../../assets/imgs/marker.png',
						shadowUrl: '../../assets/imgs/marker-shadow.png'
					})}
				>
					<Popup>
						<button onClick={() => applyResult(boundary)}>{boundary.name}</button>
					</Popup>
				</Marker>);
				layers.push(markerBoundary)
			}
			applyMap(layers)
		}
		setResult(cur_result);
	}

	const applyResult = (boundary: any) => {
		let result_ = { ...result };
		if (boundary) {
			result_.ElectionResults = boundary.candidates;
			result_.ValidVotes = boundary.votes;
			if (year === 2018)
				if (result_.TotalVotes == 0)
					result_.VotesPecentage = "0%"
				else {
					result_.VotesPecentage = ((result_.ValidVotes / result_.TotalVotes) * 100).toFixed(2) + '%'
				}
			else
				result_.VotesPecentage = "100%"
		    if (boundary.votes > 0) setNoWinner(false);
			else 
				setNoWinner(true);
			onChangeBoundary(boundary.name);
		}
		else {
			result_.ElectionResults = []
			result_.ValidVotes = 0
			result_.VotesPecentage = 0
			setNoWinner(true);
		}
		setResult(result_);
	}

	const ResizeMap = () => {
		const map: any = useMap();
		map._onResize();
		return null;
	  };
	// console.log('mapview')

	useEffect(() => {
		applyMap([]);
		drawMap();
	}, [region])

	useEffect(() => {
		setIsRoundAvailable(type === 'president' && two_rounds.indexOf(year) !== -1);
		setRound(year === 2018);
	}, [])
	
    return (
		<div className='map-view'>
			<div className="view-container">
				<MapContainer className="map" center={mapOptions.center} zoom={mapOptions.zoom} scrollWheelZoom={false}>
					<ResizeMap />
					{layers}
					{/* {layers && layers[1]} */}
					{isRoundAvailable && (<div className="round-box">
						<label>Round: First&nbsp;</label>
						<IonToggle checked={round} onChange={() => changeRound()}></IonToggle>
						<label>&nbsp;Second</label>
					</div>)}
				</MapContainer>
				{!candidatesEnable() && <div className="no-data">
					There are no results to display
				</div>}
				{candidatesEnable() && (<div>
					<div className="election-details">
						<div className="election-info">
							<IonGrid className='ion-no-padding' >
								<IonRow>
									<IonCol className="ion-text-left small">
										Total Registered Voters = { result.TotalVotes }<br />
										Percentage of votes counted: { result.VotesPecentage }<br/>
										Result Status: { result.ResultStatus }
									</IonCol>
									<IonCol className="ion-text-right small">
										Total Valid Votes: { result.ValidVotes } <br />
										Total Invalid Votes: { result.InvalidVotes }
									</IonCol>
								</IonRow>
							</IonGrid>
						</div>
						<div className="election-parties">
							<IonGrid className='ion-no-padding'>
								<IonRow>
									{Object.keys(result.Parties).map((key: any, index: number) => (<IonCol key={index} onClick={() => gotoPartyDetail(result.Parties[key])}>
										<div className="small">{ key }
										</div>
										<div className="party-card" style={{ backgroundColor: colorFilter(result.Parties[key].Color)}}></div>
									</IonCol>))}
								</IonRow>
							</IonGrid>
						</div>
						<div className="election-competitors">
							<IonGrid className="show-mobile ion-no-padding">
								{transform2d(result.ElectionResults, 2, result.ElectionResults.length).map((row: any, index: number) => (
									<IonRow key={index}>
										{row.map((candidate: any, index_: number) => (
											<IonCol className="ion-text-left small" key={index_}>
												<div className="img-wrapper" onClick={() => gotoCandidateDetail(candidate.Candidate_SLEOP_ID)}>
													<a>
														{!candidate.CandidatePhoto && <img src="/assets/imgs/avatar.png" className="ion-padding-left" />}
														{candidate.CandidatePhoto && <img src={ setPhotoUrl(candidate.CandidatePhoto) } />}
														<span>{candidate.CandidateFullName}</span>
													</a>
													<span className="votes">{ candidate.ValidVotes } <br /> { candidate.ValidVotesPercentage }% {(index == 0 && index_ == 0 && !noWinner) && <i className="fa fa-check-circle"></i>}</span>
												</div>
												<div className="card" style={{backgroundColor: colorFilter(candidate.CandidatePoliticalPartyColor)}}>
												</div>
											</IonCol>
										))}
									</IonRow>
								))}
							</IonGrid>
							<IonGrid className="show-tablet ion-no-padding">
								{transform2d(result.ElectionResults, 3, 6).map((row: any, index: number) => (
									<IonRow key={index}>
										{row.map((candidate: any, index_: number) => (
											<IonCol key={index_}>
												<div className="img-wrapper" onClick={() => gotoCandidateDetail(candidate.Candidate_SLEOP_ID)}>
													<a>
														{!candidate.CandidatePhoto && <img src="/assets/imgs/avatar.png" className="ion-padding-left" />}
														{candidate.CandidatePhoto && <img src={ setPhotoUrl(candidate.CandidatePhoto) } />}
														<span>{candidate.CandidateFullName}</span>
													</a>
													<span className="votes">{ candidate.ValidVotes } <br /> { candidate.ValidVotesPercentage }% {(index == 0 && index_ == 0 && !noWinner) && <i className="fa fa-check-circle"></i>}</span>
												</div>
												<div className="card" style={{backgroundColor: colorFilter(candidate.CandidatePoliticalPartyColor)}}>
												</div>
											</IonCol >
										))}
									</IonRow>
								))}
							</IonGrid>
							<IonGrid className="show-core ion-no-padding">
								{transform2d(result.ElectionResults, 4, 12).map((row: any, index: number) => (
									<IonRow key={index}>
										{row.map((candidate: any, index_: number) => (
											<IonCol key={index_}>
												<div className="img-wrapper" onClick={() => gotoCandidateDetail(candidate.Candidate_SLEOP_ID)}>
													<a>
														{!candidate.CandidatePhoto && <img src="/assets/imgs/avatar.png" className="ion-padding-left" />}
														{candidate.CandidatePhoto && <img src={ setPhotoUrl(candidate.CandidatePhoto) } />}
														<span>{candidate.CandidateFullName}</span>
													</a>
													<span className="votes">{ candidate.ValidVotes } <br /> { candidate.ValidVotesPercentage }% {(index == 0 && index_ == 0 && !noWinner) && <i className="fa fa-check-circle"></i>}</span>
												</div>
												<div className="card" style={{backgroundColor: colorFilter(candidate.CandidatePoliticalPartyColor)}}>
												</div>
											</IonCol>
										))}
									</IonRow>
								))}
							</IonGrid>
						</div>
					</div>
				</div>)}
			</div>
		</div>
  );
};

export default MapView;
