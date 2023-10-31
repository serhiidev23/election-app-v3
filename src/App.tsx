import { Redirect, Route } from 'react-router-dom';
import React from 'react';
import { 
  IonApp, 
  IonRouterOutlet, 
  setupIonicReact
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import Splash from './pages/Splash';
import PresidentPage from './pages/PresidentPage';
import Navigation from './components/Navigation';

import { Provider } from 'react-redux';
import { store } from './store';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';

import 'font-awesome/css/font-awesome.min.css';
import About from './pages/About';
import Parliament from './pages/Parliament';
import Mayor from './pages/Mayor';
import ChairPerson from './pages/ChairPerson';
import Councilor from './pages/Councilor';
import CandidateProfile from './pages/CandidateProfile';
import PartyProfile from './pages/PartyProfile';

setupIonicReact();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <IonApp>
        <Navigation/>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/splash" component={Splash}>
            </Route>
            <Route exact path="/president" component={PresidentPage}>
            </Route>
            <Route exact path="/about" component={About}>
            </Route>
            <Route exact path="/mayor" component={Mayor}>
            </Route>
            <Route exact path="/parliamentary" component={Parliament}>
            </Route>
            <Route exact path="/chairperson" component={ChairPerson}>
            </Route>
            <Route exact path="/councilor" component={Councilor}>
            </Route>
            <Route exact path="/candidate/:id" component={CandidateProfile}>
            </Route>
            <Route exact path="/party/:id" component={PartyProfile}>
            </Route>
            <Route exact path="/">
              <Redirect to="/splash" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
        {/* <IonNav id="content" root={() => <Splash />}></IonNav> */}
      </IonApp>
    </Provider>
  );
};

export default App;
