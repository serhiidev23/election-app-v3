import { IonPage, IonContent, IonTitle, IonToolbar, IonGrid, useIonViewDidEnter } from '@ionic/react';
import './index.css';
import React from 'react';
import HeaderView from '../../components/HeaderView';

const About: React.FC = () => {
	useIonViewDidEnter(() => {
    console.log('ionViewDidLoad AboutPage');
  })

  return (
    <IonPage id="content">
		<HeaderView type='about'>
			<IonToolbar color="dark" sub-navbar>
				<IonTitle>
					About this app
				</IonTitle>
			</IonToolbar>
		</HeaderView>
		<IonContent className='no-scroll ion-padding'>
			<IonGrid>
				<p>This app is a LAM-TECH Consulting Open Data Powered Digital Product for the people of Sierra Leone. It is primarily used to visualize Sierra Leone Election results on a map of sierra leone. It also provides the results in table format. The data source for this app is <a href="https://electiondata.io">https://electiondata.io</a> - the Open Elections Data Platform. Results are available for 2018, 2012, 2007, 2002 and 1996 presidential, parliamentary, mayor/chairperson, and local council Elections</p>
				<h4>What is LAM-TECH's role?</h4>
				<p>LAM-TECH has developed and donated to the people of Sierra Leone an open source software platform called Open Election Data Platform (OEDP) to facilitate free, fair, safe, secure and transparent elections in 2018.</p>
				<p>The primary objective of the initiative is to provide an open source and open data web-based tool to collect, aggregate, visualize and share electoral violence incident data, historic and current election data in a manner that is timely, granular, non-discriminatory, available-for free on the internet, complete-and-in-bulk, analyzable, permanently available, non-proprietary and license-free.</p>
				<p>The Source Code of the platform is free and available permanently at <a href="https://github.com/LamTechFoundationInc/oedp">https://github.com/LamTechFoundationInc/oedp</a> for anyone to review, modify and use.</p>
				<p>The data stored and processed by the platform will be managed by RAIC and shared according to open data principles. Personally identifiable information of individuals will never be shared</p>
				<h4>Why Sierra Leone OEDP?</h4>
				<p>To open election data following the nine principles of open election data and using open data tools and principles to increase the chances of free, fair, safe, secure and transparent general elections in 2018. To complement the work of current election bodies and security organizations in Sierra Leone, to prevent electoral violence through monitoring and reporting. To enable the Government, Political Parties, Researchers, Journalist, NGOs, Civil Society, and the general public use open election data in their decision-making process.</p>
				<h4>What is Open Election Data Platform?</h4>
				<p>A software platform that enables the collection, aggregation, visualization, and sharing of election results, candidate and political party information, boundary delimitations, polling stations and voter registration centres, electoral news articles, and electoral violence incident reports in accordance with global open election data principles</p>
			</IonGrid>
		</IonContent>
	</IonPage>
  );
};

export default About;
