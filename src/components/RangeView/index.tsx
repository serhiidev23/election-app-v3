import React from 'react';
import { IonList, IonListHeader, IonItem } from "@ionic/react";

interface ContainerProps { availability:any, seletGranularity: any }

const RangeViewComponent: React.FC<ContainerProps> = ({ availability, seletGranularity}) => {
  return (
    <div className='range-view'>
      {availability.region && <IonList>
        <IonListHeader>Result Granularity</IonListHeader>
        {availability.nationAvailable && <IonItem onClick={() => seletGranularity('nation')}>National Results</IonItem>}
        {availability.regionAvailable && <IonItem onClick={() => seletGranularity('region')}>Results By Region</IonItem>}
        {availability.districtAvailable && <IonItem onClick={() => seletGranularity('district')}>Results By District</IonItem>}
        {availability.constituencyAvailable && <IonItem onClick={() => seletGranularity('constituency')}>Results By Constituency</IonItem>}
        {availability.wardAvailable && <IonItem onClick={() => seletGranularity('ward')}>Results By Ward</IonItem>}
        {availability.pollingCentreAvailable && <IonItem onClick={() => seletGranularity('polling_centre')}>Results By Polling Centre</IonItem>}
      </IonList>}
    </div>
  );
};

export default RangeViewComponent;
