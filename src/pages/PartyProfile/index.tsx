import { IonPage, IonContent, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, useIonRouter } from '@ionic/react';
import './index.css';
import React, { useEffect, useState } from 'react';
import HeaderView from '../../components/HeaderView';
import { getParty } from '../../provider/data'

const PartyProfile: React.FC = () => {
	const [party, setParty] = useState<any>();
	const router = useIonRouter();

	const sourceUrl = (url: string) => {
		return "assets/imgs/party/" + url;
	}

	const colorFilter = (color: any) => {
		var default_color = "#999";
		var colors = ["Pink", "Orange", "Green", "Red", "Blue", "Purple", "Yellow"];
		if (!color) return default_color;
		if (color.split(', ').length > 1) {
			return color.split(', ')[0];
		}
		if (colors.indexOf(color.charAt(0).toUpperCase() + color.slice(1)) > -1) {
			return color;
		}
		return "#" + color;
	}

	useEffect(() => {
		const paths = router.routeInfo.pathname.split('/');
		var id = paths[paths.length - 1];
		setParty(getParty(id));
	}, [])

  return (
	<IonPage id="content">
		<HeaderView type="headerview" isGranularityEnabled={false}>
			<IonToolbar color="dark" className="ion-sub-navbar">
				<IonTitle>
					Party Details
				</IonTitle>
			</IonToolbar>
		</HeaderView>

		<IonContent className="ion-padding no-scroll page-party-profile">
			{party && <div className="">
				<IonGrid className="show-core">
					<IonRow>
						<IonCol className="ion-col-4 ion-text-center">
							<img className="party-logo" src={sourceUrl(party.Logo)} />
						</IonCol>
						<IonCol className="ion-col-8">
							<h4><a href={party.Website} target="_blank">{ party.Name }</a></h4>
							<p><strong>Founders:</strong> { party.Founders }</p>
							<p><strong>Date Founded:</strong> { party.DateFounded }</p>
							<p><strong>Description:</strong></p> <div dangerouslySetInnerHTML={{ __html: party.Description }}></div>
						</IonCol>
					</IonRow>
				</IonGrid>
				<IonGrid className="show-tablet">
					<IonRow>
						<IonCol className="ion-text-center">
							<img className="party-logo" src={sourceUrl(party.Logo)} />
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<h4><a href={party.Website} target="_blank">{ party.Name }</a></h4>
							<p><strong>Founders:</strong> { party.Founders }</p>
							<p><strong>Date Founded:</strong> { party.DateFounded }</p>
							<p><strong>Description:</strong></p> <div dangerouslySetInnerHTML={{ __html: party.Description }}></div>
						</IonCol>
					</IonRow>
				</IonGrid>
				<IonGrid className="show-mobile">
					<IonRow>
						<IonCol className="ion-text-center">
							<img className="party-logo" src={sourceUrl(party.Logo)} />
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<h4><a href={party.Website} target="_blank">{ party.Name }</a></h4>
							<p><strong>Founders:</strong> { party.Founders }</p>
							<p><strong>Date Founded:</strong> { party.DateFounded }</p>
							<p><strong>Description:</strong></p> <div dangerouslySetInnerHTML={{ __html: party.Description }}></div>
						</IonCol>
					</IonRow>
				</IonGrid>
			</div>}
			{!party && <div className="empty-info ion-padding-top">
				There is no information about this party.
			</div>}
		</IonContent>
	</IonPage>
  );
};

export default PartyProfile;
