import { IonSegmentButton, IonItem, IonLabel, IonHeader, IonSegment, IonTitle, IonButtons, IonMenuButton, IonToolbar, IonPopover, IonButton } from '@ionic/react';
import './index.css';
import React, { useState, useContext } from 'react';
import RangeViewComponent from '../RangeView';
import { NavContext, useIonViewWillEnter } from '@ionic/react';
import { menuController } from '@ionic/core';

const HeaderView: React.FC<{ type: String, children: any, isGranularityEnabled?: boolean, setGranularity?: any, availability?:any }> 
	= ({ type, children, isGranularityEnabled = true, setGranularity, availability }) => {
  let [selectdRange, setSelectedRange] = useState(false);
  const {navigate} = useContext(NavContext);

	const seletGranularity = (granularity: any) => {
    setGranularity(granularity);
		setSelectedRange(false);
  }

	const pages: any = [
		{ title: 'SLOEDP Platform', name: "", component: "" },
		{ title: 'Presidential', name: "president", component: "" },
		{ title: 'Parliamentary', name: "parliamentary", component: "" },
		{ title: 'Mayor', name: "mayor", component: "" },
		{ title: 'Chairperson', name: "chairperson", component: "" },
		{ title: 'Councilor', name: "councilor", component: "" },
		{ title: 'About this app', name: "about", component: "" },
	];

	const selectRange = (event: any) => {
		setSelectedRange(true);
	}

	const openPage = (page: any) => {
 		// Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title === 'SLOEDP Platform')
    //   window.location.href = "https://electiondata.io"
      window.location.href = "http://localhost:8100"
    else
      navigate('/' + page.name);
	}

  useIonViewWillEnter(async() => {
    await menuController.enable(true, 'content')
		menuController.open('content')
  })
 
  const openMenu = () => {
    menuController.open('content')
  }

  return (
		<IonHeader className='header-view'>
			<IonToolbar color="dark" className="show-mobile">
				<IonButtons slot="start" style={{zIndex: 100}}>
					<IonMenuButton auto-hide="false" menu="content" onClick={() => openMenu()}>
					</IonMenuButton>
					Menu
				</IonButtons>
				<IonTitle className='ion-text-uppercase ion-text-center'>sloedp</IonTitle>
				{isGranularityEnabled && (<IonButtons slot="end">
					<IonButton className="bar-button-menutoggle-md" onClick={selectRange}>
						Filter &nbsp;<i className="fa fa-ellipsis-h"></i>
					</IonButton>
				</IonButtons>)}
			</IonToolbar>
			<IonToolbar color="dark" className="show-core">
				<div className="toolbar-inner">
					<IonButton href="/" slot="end" className="ion-float-left bar-button-menutoggle-md bar-button-default-md disable-hover logo-icon">
						<img src="assets/imgs/logo.png" width="35" alt=""/> &nbsp;SLOEDP
					</IonButton>
					<IonTitle className='ion-text-uppercase ion-text-center'>
						<div className='inner'>
							<IonSegment className="page-links ion-width-50" color="primary">
								{pages.map((page: any) => 
									<IonItem routerLink={"/" + page.name}>
										<IonLabel>{page.title}</IonLabel>
									</IonItem>
								)}
								{/* {pages.map((page: any) => <IonSegmentButton key={page.name} onClick={() => openPage(page)}>{page.title}</IonSegmentButton>)} */}
							</IonSegment>
						</div>
					</IonTitle>
				</div>
			</IonToolbar>
			<IonPopover
				isOpen={selectdRange}
				// className='my-custom-class'
				onDidDismiss={() => setSelectedRange(false)}
			>
				<RangeViewComponent availability={availability} seletGranularity={seletGranularity}/>
			</IonPopover>
			{children}
		</IonHeader>
  );
};

export default HeaderView;
