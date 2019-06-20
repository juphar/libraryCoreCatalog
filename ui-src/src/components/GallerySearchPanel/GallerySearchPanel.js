import React from 'react';
import QueryString from 'query-string';
import { Link } from "react-router-dom";
import { authService } from "../../apis";

class GallerySearchPanel extends React.Component {

	userLoaded = false;

	constructor(props) {
		const qsParsed = QueryString.parse(window.location.search);
		super(props);

		this.state = {
			user: null,
			starterText: qsParsed.starter_text || null,
			frameLoaded: false
		};

		this.onLoadHandler = this.onLoadHandler.bind(this);
	}

	onLoadHandler() {

		this.setState({frameLoaded: true}, ()=>{

			let params = { _token: this.state.user.access_token };

			if( this.state.starterText ) params.text = this.state.starterText;
	
			if( this.state.frameLoaded && this.userLoaded ) this.postParamsMessage(params);
	
		});

	}

	postParamsMessage(params) {
		const microappFrameWindow = document.getElementById('microapp').contentWindow,
			microappOrigin = "https://dev.watsoneduc.com",
			inputParams = { type: 'PARAMS', data: params };
		microappFrameWindow.postMessage(inputParams, microappOrigin);
	}

	componentDidMount() {

		let promise = authService.getUser();

		let that = this;

		window.addEventListener('message', function(e){
			console.log('Host app received status from the microapp:', e.data);
			if( e.data.keywords ) that.setState({starterText: e.data.keywords});
        });

		promise.then(
			(response) => {
				this.setState({user: response.data});
				this.userLoaded = true;

				if( this.state.frameLoaded && this.userLoaded ) this.postParamsMessage({ _token: this.state.user.access_token });
			},
			(error) => {
				window.location.replace("https://watsonedu-dev.us-south.containers.appdomain.cloud/idp/api/v1/login?success_redirect=" + encodeURIComponent(window.location));
			}
		);
		
	}

	render() {

		return (
			<div className="GallerySearchPanel__wrapper">
				<header className="GallerySearchPanel__global-header">
					<h3><Link to="/" className="GallerySearchPanel__a">IBM <b>Watson Education Developer Cloud</b></Link></h3>
				</header>
				{ this.state.starterText && <div className="GallerySearchPanel__container">
						<iframe id="microapp" title="Gallery: Cognitive Search" className="GallerySearchPanel__iframe"
							src="https://dev.watsoneduc.com/library/search/"
							onLoad={this.onLoadHandler} />
					</div>}
				{ !this.state.starterText && <div className="GallerySearchPanel__container__min">
						<iframe id="microapp" title="Gallery: Cognitive Search" className={ this.state.frameLoaded ? "GallerySearchPanel__iframe__min" : "GallerySearchPanel__iframe__opaque" }
							src="https://dev.watsoneduc.com/library/search/?search_box_only=true"
							onLoad={this.onLoadHandler} />
						<div className="GallerySearchPanel__container_background_mask">
							<div className="GallerySearchPanel__container_background GallerySearchPanel__container_background_1" />
							<div className="GallerySearchPanel__container_background GallerySearchPanel__container_background_2" />
						</div>
				</div>}		
			</div>
		);
	}
};

export default GallerySearchPanel;
