import { IonGrid,  IonToggle, useIonRouter, IonRow, IonCol, useIonLoading, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import './index.css';
import React, { useEffect, useState } from 'react';
import { loadResultsByFields  } from '../../provider/data'
import { useSelector } from 'react-redux';
import { dataSelector } from '../../slices/dataSlice';
import Select from 'react-select'

interface ContainerProps { year: number, region: string, type: string, boundary: any }

const TableView: React.FC<ContainerProps> = ({year, region, type, boundary}) => {
	const [round, setRound] = useState<boolean>(true);
	const [result, setResult] = useState<any>({
		'VotesCandidate': "Total",
		'PecentageCandidate': '100%',
		'ResultStatus': "",
		'TotalVotes': "",
		'ValidVotes': "",
		'InvalidVotes': "",
		'VotesPecentage': "",
		'Parties': [],
		'Candidates': [],
		'Boundaries': [],
		'total_results': [],
		'Results': []
	});
	const [noWinner, setNoWinner] = useState<Boolean>(true);
	const [isNation, setIsNation] = useState<Boolean>(true);
	const [isRoundAvailable, setIsRoundAvailable] = useState<Boolean>();
	const two_rounds = [1996, 2007, 2018];
	const router = useIonRouter();
	const selector = useSelector(dataSelector);
	const [present, dismiss] = useIonLoading();

	const candidatesEnable = () => {
    return result.Results.length > 0;
  }

  const gotoPartyDetail = (acronym: any) => {
		router.push(`/party/${acronym}`, "forward", "push");
  }

  const gotoCandidateDetail = (candidate_id: any) => {
		router.push(`/candidate/${candidate_id}`, "forward", "push");
  }

  const drawTable = () => {
    var fields: any = {
      year: year,
      type: type,
      region: region
    }

		present({
			message: 'Loading data...',
			duration: 1000
		});

    if (type === 'president' && two_rounds.indexOf(year) !== -1)
      fields['round'] = round ? 'second' : 'first'

    setIsNation(region === 'nation');

    const data = loadResultsByFields(selector, fields);
		let cur_result = { ...result };
		cur_result.Parties = data['Parties'];
		cur_result.Candidates = data['Candidates'];
		cur_result.total_results = data['Boundaries'];

		cur_result.TotalVotes = year == 2018 ? 3178664 : data['ValidVotes'];
		cur_result.InvalidVotes = year == 2018 ? 139427 : 0;
		cur_result.ResultStatus = "Final & Certified"
			
		cur_result.Boundaries = [];
		cur_result.ValidVotes = 0;
		cur_result.VotesPecentage = "0%";
		cur_result.Results = [];

		if (data['Boundaries'].length > 0) {
			cur_result.Results = data['Boundaries'][0].candidates;
			cur_result.ValidVotes = data['Boundaries'][0].votes;
			if (year === 2023) {
				if (cur_result.TotalVotes === 0)
					cur_result.VotesPecentage = "0%"
				else {
					cur_result.VotesPecentage = ((cur_result.ValidVotes / cur_result.TotalVotes) * 100).toFixed(2) + '%'
				}
			}
			else
				cur_result.VotesPecentage = "100%"
			if (data['Boundaries'][0].votes > 0) setNoWinner(false);
			else setNoWinner(true);

			for (let row of data['Boundaries']) {
				if (type == 'mayor')
					cur_result.Boundaries.push({id: row.name, text: row.name_council});
				else
					cur_result.Boundaries.push({id: row.name, text: row.name});
			}
		}
		dismiss();
		setResult(cur_result);
  }

  const onSelectChange = (selectedValue: any) => {
		let cur_result = { ...result };
		cur_result.total_results.forEach(function(data: any) {
			if (data.name === selectedValue) {
				cur_result.Results = data.candidates;
				cur_result.ValidVotes = data.votes;
				if (year == 2023)
				if (cur_result.TotalVotes == 0)
					cur_result.VotesPecentage = "0%"
				else {
					cur_result.VotesPecentage = ((cur_result.ValidVotes / cur_result.TotalVotes) * 100).toFixed(2) + '%'
				}
				else
					cur_result.VotesPecentage = "100%"
				if (data.votes > 0) setNoWinner(false);
				else setNoWinner(true);;
				if (cur_result.Results[0]['ValidVotes'] > 0)
					setNoWinner(false);
				else
					setNoWinner(true);
			}
		});
		setResult(cur_result);
	}

	const sortfunc = function(a: any, b: any) {
		if (a.text > b.text) return 1;
		else if (a.text < b.text) return -1;
		return 0; 
	}
	
  useEffect(() => {
		setIsRoundAvailable(type === 'president' && two_rounds.indexOf(year) !== -1);
		setRound(year === 2018);
		drawTable();
	}, [])

  return (
	<div className='table-view'>
		{!isNation && <IonGrid>
			<IonRow>
				<IonCol className="ion-col-3 ion-text-right filter-text">Filter: </IonCol>
				<IonCol className="ion-col-9">
					{/* <Select 
						className="select-boundaries" 
						options={result.Boundaries.map((item: any) => ({ value: item.id, label: item.text}))} 
						value={boundary} 
						onChange={(value) => onSelectChange(value)} 
					/> */}
					<IonSelect className="select-boundaries" interface="popover" placeholder="Select" onIonChange={(e) => onSelectChange(e.target.value)} >
						{result.Boundaries.sort(sortfunc).map((item: any) => (
							<IonSelectOption value={item.id}>{item.text}</IonSelectOption>
						))}
					</IonSelect>
				</IonCol>
			</IonRow>
		</IonGrid>}
		{isRoundAvailable && (<div className="round-box">
			<label>Round: First&nbsp;</label>
			<IonToggle checked={round} onChange={() => drawTable()}></IonToggle>
			<label>&nbsp;Second</label>
		</div>)}

		<table className='ion-margin-top'>
			<thead>
				<tr>
					<th>Candidate</th>
					<th>Party</th>
					<th>Votes</th>
					<th>Percentage</th>
				</tr>
			</thead>
			{candidatesEnable() && <tbody>
				{result.Results.map((item: any, index: number) => (<tr>
					<td><a onClick={() => gotoCandidateDetail(item['Candidate_SLEOP_ID'])}>{item['CandidateFullName']}</a> &nbsp;{index == 0 && !noWinner && <i className="fa fa-check-circle"></i>}</td>
					<td><a onClick={() => gotoPartyDetail(item['CandidatePoliticalParty'])}>{ item['CandidatePoliticalParty'] }</a></td>
					<td>{ item['ValidVotes'] }</td>
					<td>{ item['ValidVotesPercentage'] }</td>
				</tr>))}
			</tbody>}
			{!candidatesEnable() && <tbody>
				<tr>
					<td colSpan={4}>There are no election datas</td>
				</tr>
			</tbody>}
			<tfoot>
				<tr>
					<td>Total</td>
					<td></td>
					<td>{ result.ValidVotes }</td>
					<td>100%</td>
				</tr>
			</tfoot>
		</table>
		{candidatesEnable() && <div className="election-info ion-padding-top">
			<IonGrid className='ion-no-padding'>
				<IonRow>
					<IonCol class="small ion-text-left">
						Total Registered Voters = { result.TotalVotes }<br />
						Percentage of votes counted: { result.VotesPecentage }<br />
						Result Status: { result.ResultStatus }
					</IonCol>
					<IonCol class="small ion-text-right">
						Total Valid Votes: { result.ValidVotes }<br />
						Total Invalid Votes: { result.InvalidVotes }
					</IonCol>
				</IonRow>
			</IonGrid>
		</div>}
	</div>	
	);
};

export default TableView;
