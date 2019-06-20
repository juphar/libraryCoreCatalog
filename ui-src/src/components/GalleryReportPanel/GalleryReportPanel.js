import React from 'react';
import { Link } from "react-router-dom";
import { authService } from "../../apis";

class GalleryReportPanel extends React.Component {

	frameLoaded = false;
	userLoaded = false;

	constructor(props) {
		super(props);

		this.state = {
			user: null
		};

		this.onLoadHandler = this.onLoadHandler.bind(this);
	}

	onLoadHandler() {

		this.frameLoaded = true;

		if( this.frameLoaded && this.userLoaded ) this.postParamsMessage({ _token: this.state.user.access_token });

	}

	postParamsMessage(params) {
		const microappFrameWindow = document.getElementById('microapp').contentWindow,
			microappOrigin = "https://dev.watsoneduc.com",
			inputParams = { type: 'PARAMS', data: params };
		microappFrameWindow.postMessage(inputParams, microappOrigin);
	}

	componentDidMount() {

		let promise = authService.getUser();

		promise.then(
			(response) => {
				this.setState({user: response.data});
				this.userLoaded = true;

				if( this.frameLoaded && this.userLoaded ) this.postParamsMessage({ _token: this.state.user.access_token });
			},
			(error) => {
				window.location.replace("https://watsonedu-dev.us-south.containers.appdomain.cloud/idp/api/v1/login?success_redirect=" + encodeURIComponent(window.location));
			}
		);
		
	}

	render() {

		return (
			<div className="GalleryReportPanel__wrapper">
				<header className="global-header">
					<h3><Link to="/" className="GalleryReportPanel__a">IBM <b>Watson Education Developer Cloud</b></Link></h3>
				</header>
				<div className="container">
					<iframe id="microapp" title="Gallery: Cognitive Library Report" className="GalleryReportPanel__iframe" 
						src="https://dev.watsoneduc.com/library/report/" 
						onLoad={this.onLoadHandler} />
				</div>
			</div>
		);
	}
};

export default GalleryReportPanel;
