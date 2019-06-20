import React from 'react';
import { authService } from "../../apis";

class LandingPanel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null
		};

		// This binding is necessary to make `this` work in the callback
		this.handleClick = this.handleClick.bind(this);
	  }

	handleClick(e) {

	}

	componentDidMount() {

		let promise = authService.getUser();

		promise.then(
			(response) => {
				this.setState({user: response});
			},
			(error) => {
				window.location.replace("https://watsonedu-dev.us-south.containers.appdomain.cloud/idp/api/v1/login?success_redirect=" + encodeURIComponent(window.location));
			}
		);

		window.addEventListener('message', (e)=>{ 
			
			if( e.data === 'library-admin') { window.location.assign("../#/gallery/onboarding/"); }
			else if( e.data === 'library-reports') { window.location.assign("../#/gallery/report/"); }
			else if( e.data === 'library-docs-search') { window.location.assign("../library/search/docs/"); }
			else if( e.data === 'library-api-core') { window.location.assign("https://watsonedu-dev.us-south.containers.appdomain.cloud/content_library/api/v1/api_explorer/index.html"); }
			else if( e.data === 'library-api-recommendations') { window.location.assign("https://watsonedu-dev.us-south.containers.appdomain.cloud/documentation/api_explorer/index.html?spec_url=https%3A%2F%2Fwatsonedu-dev.us-south.containers.appdomain.cloud%2Fcontent_recommender%2Fapi_explorer%2Fapi.yaml"); }

		});
		
	}

	render() {

		return (
			<div className="LandingPanel__wrapper">
				<iframe title="Landing Page" className="LandingPanel__iframe" src="./frame/index.html" />
			</div>
		);
	}
};

export default LandingPanel;
