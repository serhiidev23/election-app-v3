import React from 'react';
import { 
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonList,
} from '@ionic/react';
import './index.css';

const Navigation: React.FC = () => {
	const pages = [
		{ title: 'SLOEDP Platform', name: "", component: "" },
		{ title: 'Presidential', name: "president", component: '' },
		{ title: 'Parliamentary', name: "parliamentary", component: '' },
		{ title: 'Mayor', name: "mayor", component: '' },
		{ title: 'Chairperson', name: "chairperson", component: '' },
		{ title: 'Councilor', name: "councilor", component: '' },
		{ title: 'About this app', name: "about", component: '' },
		// { title: 'VillageHeadman', component: VillageHeadmanPage }
	];


	return (<IonMenu contentId="content" menuId='content' type="overlay" className='navigation menu-inner'>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Election Type</IonTitle>
					<IonMenuButton auto-hide="false" slot="end" >
					</IonMenuButton>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonList>
					{pages.map((page: any) => (
						<IonItem routerLink={"/" + page.name}>
							<IonLabel>{page.title}</IonLabel>
						</IonItem>
					))}
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default Navigation;
