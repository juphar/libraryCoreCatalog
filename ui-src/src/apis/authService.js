import axios from 'axios';

export default (function () {

    let _service = {}

    _service.getUser = function (input) {

        let options = {
            method: 'get',
            url: 'https://watsonedu-dev.us-south.containers.appdomain.cloud/idp/api/v1/me',
            withCredentials: true
        };

        var promise = axios(options);

        return promise;
    }

    return _service;

})();