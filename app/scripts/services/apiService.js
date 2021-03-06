// service for doing api calls

'use strict';

angular.module('mdToolApp')
  .factory('apiService', function ($http, $window) {

    var apiBaseUrl;

    function setApiBaseUrl() {
      var path = $window.location.pathname;

      // if app runs on port 9000, use a fixed base path to reach api from remote
      if ($window.location.port === '9000') {
        apiBaseUrl = 'https://demodwm3.dilax.com/davisweb/rest/md/';
      } else {
        apiBaseUrl = '/' + path.split('/')[1] + '/rest/md/';
      }
    }

    function getRawData(resource, paramsObj) {
      return $http.get(apiBaseUrl + 'raw/' + resource, { params: paramsObj });
    }

    function getScheduleData(resource, paramsObj) {
      return $http.get(apiBaseUrl + 'schedule/' + resource, { params: paramsObj });
    }

    function putScheduleData(resource, data) {
      return $http.put(apiBaseUrl + 'schedule/' + resource, angular.toJson(data));
    }

    function getCountData(resource, paramsObj) {
      return $http.get(apiBaseUrl + 'count/' + resource, { params: paramsObj });
    }

    function getMatchedData(resource, paramsObj) {
      return $http.get(apiBaseUrl + 'match/' + resource, { params: paramsObj });
    }

    setApiBaseUrl();

    // Public API here
    return {
      getRawData: getRawData,
      getScheduleData: getScheduleData,
      putScheduleData: putScheduleData,
      getCountData: getCountData,
      getMatchedData: getMatchedData
    };

  });
