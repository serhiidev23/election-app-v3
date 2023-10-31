import parties from '../assets/resources/all-political-parties.json';
import candidates from '../assets/resources/all-candidates.json';

export const toPartiesJson = (parties: any) => {
  var parties_json: any = {};
  for(let party of parties) {
    parties_json[party['Acronym']] = party;
  }
  return parties_json;
};

export const toCandidatesJson = (candidates: any) => {
  var candidates_json: any = {};
  for(let candidate of candidates) {
    candidates_json[candidate['CandidateSLEOP_ID']] = candidate;
  }
  return candidates_json;
};

export const toPollingCentresJson = (polling_centres: any) => {
  var polling_centres_json: any = {}, PollingCentreKey;
  for(let polling_centre of polling_centres) {
    PollingCentreKey = makeKey(polling_centre['PollingCentreName']);
    polling_centres_json[PollingCentreKey] = polling_centre;
  }
  return polling_centres_json;
};

export const getBoundaryName = (election_result: any, fields: any) => {
  var boundary_field = "";
  var year = Number(fields.year);
  if (fields.region == "nation") return "Sierra Leone";
  else {
    switch (fields.region) {
      case "region":
        boundary_field = year < 2018 ? "ElectionRegion" : "ElectionRegion";
        break;
      case "district":
        boundary_field = year < 2018 ? "ElectionDistrict" : "ElectionDistrict";
        break;
      case "constituency":
        boundary_field = year < 2018 ? "ElectionConstituency" : "ElectionConstituency";
        break;
      case "ward":
        boundary_field = year < 2018 ? "ElectionWard" : "ElectionWard";
        break;
      case "polling_centre":
        boundary_field = "PollingCentreName";
        break;
      default:
        break;
    }
  }

  return election_result[boundary_field];
}

export const toArray = (json: any) => {
  var ary = [];
  for (let key in json) {
    ary.push(json[key]);
  }
  return ary;
};

export const makeKey = (value: any = '') => {
  return value.toLowerCase().replace(/\ /gi, '_');
};

export const getResultType = (boundary: any) => {
  var result_type = '';
  switch (boundary) {
    case "nation":
      result_type = "National Results";
      break;
    case "region":
      result_type = "Regional Results";
      break;
    case "district":
      result_type = "District Results";
      break;
    case "constituency":
      result_type = "Constituency Results";
      break;
    case "ward":
      result_type = "Ward Results";
      break;
    case "polling_centre":
      result_type = "Polling Centre Results";
      break;
    default:
      // code...
      break;
  }

  return result_type;
};

export const getResultsByYear = (results: any, year: any) => {
  return results.filter((election_result: any) => {
    return year == election_result["ElectionDate"].substring(0, 4) ? election_result : '';
  })
};

export const getResultsByBoundary = (election_results: any, boundary: any) => {
  var result_type = getResultType(boundary);
  return election_results? election_results.filter((election_result: any) => {
    return election_result.ResultType == result_type ? election_result : '';
  }): []
};

export const getResultsByRound = (election_results: any, round: any) => {
  return election_results.filter(function(election_result: any) {
    return round == 'second' ? election_result['ElectionRound'] == 'Second Round' : election_result['ElectionRound'] != 'Second Round'
  })
};

export const makeResultsByBoundary = (election_results: any, fields: any, polling_centres_json: any) => {
  var boundary_results = getResultsByBoundary(election_results, fields.region);
  if (fields.type == 'president')
    boundary_results = getResultsByRound(boundary_results, fields.round)
  
  var result_temp_boundaries: any = {}, temp_candidates:any = {}, temp_parties: any = {};
  var missing_parties = [], missing_names = [];
  var party, CandidateFullName, CandidateKey, BoundaryName, BoundaryKey, Votes, Latitude, Longitude, PollingCentreKey;

  for (let election_result of boundary_results) {
    party = election_result['CandidatePoliticalParty'];
    CandidateFullName = election_result['CandidateFirstName'].trim() + ' ' + election_result['CandidateSurname'].trim();
    if (party == '') { missing_parties.push(election_result); continue; }
    if (CandidateFullName == " ") { missing_names.push(election_result); continue; }

    CandidateKey = makeKey(CandidateFullName);
    if (!temp_candidates[CandidateKey])
      temp_candidates[CandidateKey] = party;
    if (!temp_parties[party])
      temp_parties[party] = CandidateFullName;

    Votes = Number(election_result['ValidVotes']);
    BoundaryName = getBoundaryName(election_result, fields);
    BoundaryKey = makeKey(BoundaryName);
    if (election_result['PollingCentreName'] && election_result['PollingCentreName'] != "")
      PollingCentreKey = makeKey(election_result['PollingCentreName']);

    Latitude = polling_centres_json[PollingCentreKey] ? polling_centres_json[PollingCentreKey]['PollingCentreLatitude'] : "";
    Longitude = polling_centres_json[PollingCentreKey] ? polling_centres_json[PollingCentreKey]['PollingCentreLongitude'] : "";

    if (BoundaryName != "") {
      if (!result_temp_boundaries[BoundaryKey]) {
        result_temp_boundaries[BoundaryKey] = {
          votes: Votes,
          name: BoundaryName,
          latitude: Latitude,
          longitude: Longitude,
          candidates: {}
        };
        if (fields.type == 'mayor')
          result_temp_boundaries[BoundaryKey]['name_council'] = election_result['ElectionCouncil'];
        result_temp_boundaries[BoundaryKey]['candidates'][party] = Object.assign({}, election_result);
      }
      else {
        if (!result_temp_boundaries[BoundaryKey]['candidates'][party]) {
          if (fields.type == 'mayor' && election_result['ElectionCouncil'] != '')
            result_temp_boundaries[BoundaryKey]['name_council'] = election_result['ElectionCouncil'];
          result_temp_boundaries[BoundaryKey]['candidates'][party] = Object.assign({}, election_result);
          result_temp_boundaries[BoundaryKey]['votes'] += Votes;
        }
      }

      result_temp_boundaries[BoundaryKey]['candidates'][party]['ValidVotes'] = Votes;
      result_temp_boundaries[BoundaryKey]['candidates'][party]['CandidateFullName'] = CandidateFullName;
    }
  }

  for (let election_result of missing_parties) {
    CandidateFullName = election_result['CandidateFirstName'].trim() + ' ' + election_result['CandidateSurname'].trim();
    CandidateKey = makeKey(CandidateFullName);
    party = temp_candidates[CandidateKey];
    if (party) {
      Votes = Number(election_result['ValidVotes']);
      BoundaryName = getBoundaryName(election_result, fields);
      BoundaryKey = makeKey(BoundaryName);

      if (result_temp_boundaries[BoundaryKey] && !result_temp_boundaries[BoundaryKey]['candidates'][party]) {
        if (fields.type == 'mayor' && election_result['ElectionCouncil'] != '')
            result_temp_boundaries[BoundaryKey]['name_council'] = election_result['ElectionCouncil'];
        result_temp_boundaries[BoundaryKey]['candidates'][party] = Object.assign({}, election_result);
        result_temp_boundaries[BoundaryKey]['candidates'][party]['ValidVotes'] = Votes;
        result_temp_boundaries[BoundaryKey]['candidates'][party]['CandidateFullName'] = CandidateFullName;
        result_temp_boundaries[BoundaryKey]['votes'] += Votes;
      }
    }
  }

  for (let election_result of missing_names) {
    party = election_result['CandidatePoliticalParty'];
    if (temp_parties[party]) {
      Votes = Number(election_result['ValidVotes']);
      BoundaryName = getBoundaryName(election_result, fields);
      BoundaryKey = makeKey(BoundaryName);

      if (result_temp_boundaries[BoundaryKey] && !result_temp_boundaries[BoundaryKey]['candidates'][party]) {
        if (fields.type == 'mayor' && election_result['ElectionCouncil'] != '')
            result_temp_boundaries[BoundaryKey]['name_council'] = election_result['ElectionCouncil'];
        result_temp_boundaries[BoundaryKey]['candidates'][party] = Object.assign({}, election_result);
        result_temp_boundaries[BoundaryKey]['candidates'][party]['ValidVotes'] = Votes;
        result_temp_boundaries[BoundaryKey]['candidates'][party]['CandidateFullName'] = CandidateFullName;
        result_temp_boundaries[BoundaryKey]['votes'] += Votes;
      }
    }
  }

  var row, temp_candidate_ary, total_votes;
  for (let key1 in result_temp_boundaries) {
    temp_candidate_ary = [];
    row = result_temp_boundaries[key1]['candidates'];
    total_votes = result_temp_boundaries[key1]['votes'];
    for(let key2 in row) {
      row[key2]['ValidVotesPercentage'] = total_votes == 0 ? 0 : ((row[key2]['ValidVotes'] / total_votes) * 100).toFixed(2)
      temp_candidate_ary.push(row[key2]);
    }

    temp_candidate_ary.sort((a, b) => {
      var nameA = a.CandidatePoliticalParty.toUpperCase(); // ignore upper and lowercase
      var nameB = b.CandidatePoliticalParty.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    })
    temp_candidate_ary.sort((a, b) => b.ValidVotes - a.ValidVotes);

    if (temp_candidate_ary[0].ValidVotes == 0) temp_candidate_ary[0].CandidatePoliticalPartyColor = '999'
    result_temp_boundaries[key1]['candidates'] = temp_candidate_ary;
  }

  return toArray(result_temp_boundaries);
};

export const mergeResultsByBoundary = (original_boundaries: any, range: any, year: any) => {
  var result_type = getResultType(range);
  var electionResults = [];
  var temp_election_results: any = {}, BoundaryName, BoundaryKey, CandidateKey;
  for (let boundary of original_boundaries) {
    BoundaryName = getBoundaryName(boundary.candidates[0], {region: range, year: year});
    BoundaryKey = makeKey(BoundaryName);
    if (!temp_election_results[BoundaryKey])
      temp_election_results[BoundaryKey] = {};
    for (let candidate of boundary.candidates) {
      CandidateKey = candidate['Candidate_SLEOP_ID'];
      if (!temp_election_results[BoundaryKey][CandidateKey])
        temp_election_results[BoundaryKey][CandidateKey] = Object.assign({}, candidate);
      else
        temp_election_results[BoundaryKey][CandidateKey]['ValidVotes'] += candidate['ValidVotes'];
    }
  }

  var boundary_result, election_result;
  for (let key in temp_election_results) {
    boundary_result = temp_election_results[key];

    for (let key1 in boundary_result) {
      election_result = Object.assign({}, boundary_result[key1]);
      election_result['ResultType'] = result_type;
      electionResults.push(election_result);
    }
  }

  return electionResults;
};

export const getParty = (party: any) => {
  const parties_json = toPartiesJson(parties);
  return parties_json[party]
};

export const getCandidate = (candidate_id: any) => {
  const candidates_json = toCandidatesJson(candidates);
  return candidates_json[candidate_id]
};


export const loadResultsByFields = (cur_state: any, fields: any) => {
  let state = JSON.parse(JSON.stringify(cur_state));

  if (!state.results) {
    state.results = {}
  }

  if (!state.results[fields.type]) 
    state.results = {
      ...state.results,
      [fields.type]: {}
    };

  if (!state.results[fields.type][fields.year]) {
    state.results[fields.type] = {
      ...state.results[fields.type],
      [fields.year]: {}
    }
  }

  const type_results = state.whole_results[fields.type];
  let nextState = {
    all: {},
    whole_results: {},
    polling_centres_json: {}
  }

  if (type_results) {
    nextState = {
      all: getResultsByYear(type_results, fields.year),
      whole_results: state.whole_results,
      polling_centres_json: toPollingCentresJson(state.whole_results['polling_centre']),
    };
  }

  state = {
    ...state,
    whole_results: nextState.whole_results,
    polling_centres_json: nextState.polling_centres_json
  }

  state.results[fields.type][fields.year] = {};
  state.results[fields.type][fields.year]['all'] = nextState.all;

  if (fields.type === 'president') {
    if (!state.results[fields.type][fields.year][fields.region]) { state.results[fields.type][fields.year][fields.region] = {} }
    if (!state.results[fields.type][fields.year][fields.region][fields.round])
      state.results[fields.type][fields.year][fields.region][fields.round] = makeResultsByBoundary(state.results[fields.type][fields.year]['all'], fields, state.polling_centres_json);
  }
  else {
    if (!state.results[fields.type][fields.year][fields.region]) {
      state.results[fields.type][fields.year][fields.region] = makeResultsByBoundary(state.results[fields.type][fields.year]['all'], fields, state.polling_centres_json);
    }
  }

  var total_votes = 0;
  if (state.results[fields.type][fields.year][fields.region].length > 0)
  {
    state.results[fields.type][fields.year][fields.region].forEach(function(value: any) {
      total_votes += value['votes']
    })
  }

  var results = fields.type == 'president' ? state.results[fields.type][fields.year][fields.region][fields.round] : state.results[fields.type][fields.year][fields.region]
  return {
    ...state,
    type: fields.type,
    year: fields.year,
    region: fields.region,
    ValidVotes: total_votes,
    Parties: toPartiesJson(parties),
    Candidates: toCandidatesJson(candidates),
    Boundaries: results
  }
}