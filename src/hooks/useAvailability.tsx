import { useState, useEffect, useCallback } from 'react';

interface AvailabilityStatus {
    nationAvailable: boolean,
    regionAvailable: boolean,
    districtAvailable: boolean,
    constituencyAvailable: boolean,
    wardAvailable: boolean,
    pollingCentreAvailable: boolean,
    region: string | String | null
}

const useAvailability = (type: string | String, year?: number) => {
    const initialState = {
        nationAvailable: false,
        regionAvailable: false,
        districtAvailable: false,
        constituencyAvailable: false,
        wardAvailable: false,
        pollingCentreAvailable: false,
        region: null
    }

    const [state, setState] = useState<AvailabilityStatus>(initialState);
    const last_year = 2018;

    const seletGranularity = (granularity: any) => {
        setState(state => ({...state, region: granularity}));
    };

    const initState = useCallback(() => {
        const nextState: AvailabilityStatus = initialState;
        if (type === "villageheadman") {
			nextState.pollingCentreAvailable = true;
		}
		else {
            switch (type) {
                case "president":
                    nextState.nationAvailable = true;
                    nextState.regionAvailable = true;
                    nextState.districtAvailable = true;
                    if (state.region !== "nation" && state.region !== "region" && state.region !== "district") {
                        nextState.region = "nation";
                        if(year && year !== last_year && state.region) nextState.region = 'nation'
                    }
                    break;
                case "parliament":
                    nextState.constituencyAvailable = true;
                    if (state.region !== "constituency") {
                        nextState.region = "constituency";
                        if(year && year !== last_year && state.region) nextState.region = 'constituency' 
                    }
                    break;
                case "mayor":
                    nextState.districtAvailable = true;
                    if (state.region !== "district") {
                        nextState.region = "district";
                        if(year && year !== last_year && state.region) nextState.region = 'district' 
                    }
                    break;
                case "chairperson":
                    nextState.districtAvailable = true;
                    if (state.region !== "district") {
                        nextState.region = "district";
                        if(year && year !== last_year && state.region) nextState.region = 'district'
                    }
                    break;
                case "councilor":
                    nextState.wardAvailable = true;
                    if (state.region !== "ward") {
                        nextState.region = "ward";
                        if(year && year !== last_year && state.region) nextState.region = 'ward'
                    }
                    break;
                default:
                    // code...
                    break;
            }
		}
        setState(nextState);
    }, [type, year, initialState, state.region]);

    useEffect(() => {
        initState();
    }, [])
  
    return [state, seletGranularity] as const;
}

export { useAvailability };
