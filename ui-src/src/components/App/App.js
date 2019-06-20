import React from 'react';
import { HashRouter, Route } from 'react-router-dom'
import LandingPanel from '../LandingPanel';
import GallerySearchPanel from '../GallerySearchPanel';
import GalleryOnboardingPanel from '../GalleryOnboardingPanel';
import GalleryReportPanel from '../GalleryReportPanel';
import GalleryRecommendationPanel from '../GalleryRecommendationPanel';

const App = () => (
	<HashRouter hashType="slash">
	  <div className="App__wrapper">  
			<Route exact path="/" component={LandingPanel} />
			<Route path="/gallery/search/" component={GallerySearchPanel} />
			<Route path="/gallery/onboarding/" component={GalleryOnboardingPanel} />
			<Route path="/gallery/report/" component={GalleryReportPanel} />
			<Route path="/gallery/recommendation/" component={GalleryRecommendationPanel} />
	  </div>
	</HashRouter>
);

export default App;
