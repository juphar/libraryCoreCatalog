import React from 'react';
import { Link } from "react-router-dom";
import { Button, TextArea } from 'carbon-components-react';
import { authService } from "../../apis";

class GalleryRecommendationPanel extends React.Component {

	frameLoaded = false;
	userLoaded = false;

	constructor(props) {
		super(props);

		this.onLoadHandler = this.onLoadHandler.bind(this);
		this.onSubmitHandler = this.onSubmitHandler.bind(this);
	}

	onLoadHandler() {

		this.frameLoaded = true;

		if( this.frameLoaded && this.userLoaded ) this.postParamsMessage({ _token: this.state.user.access_token });

	}

	onSubmitHandler() {
		let text = document.getElementById('input').value;

		if( text ) this.postParamsMessage({text: text});

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
			<div className="GalleryRecommendationPanel__wrapper">
				<header className="global-header">
					<h3><Link to="/" className="GalleryRecommendationPanel__a">IBM <b>Watson Education Developer Cloud</b></Link></h3>
				</header>
				<div className="input">
					<TextArea
						className="input-text"
						hideLabel={false}
						labelText="Text Used For Recommendation"
						invalidText="A valid value is required"
						id="input"
					/>
					<Button className="submit" onClick={this.onSubmitHandler}>Submit</Button>
				</div>
				<div className="container">
					<iframe id="microapp" title="Gallery: Cognitive Library Recommendation" className="GalleryRecommendationPanel__iframe" 
						src="https://dev.watsoneduc.com/library/recommendation/" 
						onLoad={this.onLoadHandler} />
				</div>
			</div>
		);
	}
};

export default GalleryRecommendationPanel;
