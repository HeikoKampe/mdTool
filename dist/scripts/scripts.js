"use strict";angular.module("mdToolApp",["ngRoute","google-maps"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/map2/:vehicleId/:startTime",{templateUrl:"views/map2.html",controller:"Map2Ctrl"}).when("/map3",{templateUrl:"views/map3.html",controller:"Map3Ctrl"}).otherwise({redirectTo:"/"})}]),angular.module("mdToolApp").controller("MainCtrl",["$scope","$http","apiService",function(a,b,c){a.queryParams={dateFrom:"2014-01-01",dateTo:"2014-01-02"},a.selectedTable="vehicles",a.getMatchedDataLines=function(){c.getMatchedData("lines",a.queryParams).then(function(b){console.log("res.data matched",b.data),a.matchingResultDataLines=b.data})},a.getMatchedDataBlocks=function(){c.getMatchedData("blocks",a.queryParams).then(function(b){console.log("res.data matched",b.data),a.matchingResultDataBlocks=b.data})},a.getRawData=function(){c.getRawData("stops/",a.queryParams).then(function(b){console.log("res.data",b.data),a.stopstatisticResultData=b.data})},a.submit=function(){a.getMatchedDataLines(),a.getMatchedDataBlocks(),a.getRawData()},a.getMatchedDataLines(),a.getMatchedDataBlocks(),a.getRawData()}]),angular.module("mdToolApp").controller("Map2Ctrl",["$scope","$routeParams","$filter","$log","apiService","sequenceService","gMapService",function(a,b,c,d,e,f,g){function h(a){for(var b=0;b<a.length;b++)if(a[b].latitude>0&&a[b].longitude>0){g.setMapCenter(a[b].latitude,a[b].longitude);break}}function i(b){var c=new Date(parseInt(b)).toISOString();a.isoDate=c.split("T")[0]}function j(b){a.spinner[b]=!a.spinner[b]}function k(b){return e.getScheduleData("stops?operationDay="+a.isoDate+"&blockKey="+b)}function l(a){return c("uniqueFilter")(a,"properties.blockLabel")}function m(){j(0),e.getRawData("stops/"+b.vehicleId+"/"+b.startTime+"?dateFrom="+a.isoDate+"&dateTo="+a.isoDate).then(function(b){d.info("getStopsOfSelectedVehicle",b.data),j(0),h(b.data),a.rawStopsSequences=f.createStopSequences(b.data,"cntTripKey"),a.matchingBlocks=l(a.rawStopsSequences),a.selectedMatchingBlock=a.matchingBlocks[0],d.info("$scope.matchingBlocks",a.matchingBlocks)})}function n(){j(2),e.getScheduleData("blocks?operationDay="+a.isoDate).then(function(b){d.info("res.blocksOfDay",b.data),j(2),a.blocksOfDay=b.data})}a.mapConfig=g.getMapConfig(),a.rawStopsSequences=[],a.scheduledStopSequencesOfMatchingBlock=[],a.scheduledStopSequencesOfSelectedBlock=[],a.selectedMatchingBlock=null,a.vehicleId=b.vehicleId,a.spinner=[!1,!1,!1],a.highlightMarker={visible:!1,latitude:51.06093,longitude:13.68995},a.submitBlockForm=function(){j(2),k(a.selectedBlock.blockKey).then(function(b){j(2),d.info("res.getScheduledTripsOfBlock",b.data),a.scheduledStopSequencesOfSelectedBlock=f.createStopSequences(b.data,"tripKey")})},a.showSelectedMatchingBlock=function(){a.selectedMatchingBlock&&a.selectedMatchingBlock.properties.blockKey&&(j(1),k(a.selectedMatchingBlock.properties.blockKey).then(function(b){j(1),d.info("res.showSelectedMatchingBlock",b.data),a.scheduledStopSequencesOfMatchingBlock=f.createStopSequences(b.data,"tripKey")}))},a.setHighlightMarker=function(b,c){a.highlightMarker.latitude=b,a.highlightMarker.longitude=c,a.highlightMarker.visible=!0},a.unsetHighlightMarker=function(){a.highlightMarker.visible=!0},a.$watch("selectedMatchingBlock",function(){a.showSelectedMatchingBlock()}),i(b.startTime),m(),n()}]),angular.module("mdToolApp").controller("Map3Ctrl",["$scope","$routeParams","$filter","$log","apiService","sequenceService","gMapService","messagesService","helperService","eventService",function(a,b,c,d,e,f,g,h,i){function j(){x=c("sequenceFilter")(a.linePointsSequences,"properties.visible",!0,"properties.lineKey")}function k(){var b,d;for(b=0;b<x.length;b++)d=c("sequenceFilter")(a.linePointsSequences,"properties.lineKey",x[b])[0],d.properties.visible=!0}function l(){var b={pointLabel:a.selectedMarker.pointLabel,latitude:a.selectedMarker.latitudeNew,longitude:a.selectedMarker.longitudeNew};j(),b.pointLabel&&b.latitude&&b.longitude?v():d.error("Error at updateLinePointCoordinates(): missing data")}function m(b){var c=b.getBounds(),d=c.getSouthWest(),e=c.getNorthEast();a.queryParams.lat1=d.lat(),a.queryParams.lon1=d.lng(),a.queryParams.lat2=e.lat(),a.queryParams.lon2=e.lng()}function n(){a.showMap=!0}function o(b){a.spinner[b]=!a.spinner[b]}function p(a){var b=i.getHalfWayThroughPointOfLine(a);g.setMapCenter(b.lat,b.lng)}function q(a){var b="?";return angular.forEach(a,function(a,c){b=b+c+"="+a+"&"}),b}function r(b){angular.forEach(b,function(b){b&&"Y"===b.hasCntStop?a.stopVariation.matched.push(b):a.stopVariation.unmatched.push(b)})}function s(){g.getMapZoomLevel()<14?(y=!0,g.setMapZoomLevel(14)):t()}function t(){a.stopVariation={matched:[],unmatched:[]},o(0),e.getRawData("stops/scattering"+q(a.queryParams)).then(function(b){o(0),console.log(b.data),a.messages.numberOfStops=b.data.length,a.messages.loading="",a.messages.lengthWarning="",b.data.length<a.maxNumberOfStops?(r(b.data),a.messages.lengthWarning=""):a.messages.lengthWarning=h.messages.tooManyResults})}function u(d){var e;b.lineKey?(e=c("sequenceFilter")(a.linePointsSequences,"properties.lineKey",b.lineKey)[0],e.properties.visible=!0,p(e.data)):(p(d[0].data),d[0].properties.visible=!0)}function v(){o(1),a.selectedMarker={},e.getScheduleData("linepoints").then(function(b){o(1),a.linePointsSequences=f.createLinePointSequences(b.data,"lineKey"),console.log("$scope.linePointsSeq",a.linePointsSequences),z&&(u(a.linePointsSequences),z=!1),x&&k(),n()})}var w,x,y=!0,z=!0;a.mapConfig=g.getMapConfig(),a.stopVariation={matched:[],unmatched:[]},a.linePointsSequences=[],a.maxNumberOfStops=5e3,a.showMap=!1,a.showMatchedStopVariation=!0,a.showUnmatchedStopVariation=!0,a.spinner=[!1,!1],a.queryParams={dateFrom:b.dateFrom,dateTo:b.dateTo,lat1:0,lon1:0,lat2:0,lon2:0},a.messages={lengthWarning:"",loading:"",nStops:""},a.mapEvents={dragend:function(a){m(a)},zoom_changed:function(a){m(a)},tilesloaded:function(b){a.$apply(function(){w=b,console.log("MAP LOADED"),m(b),y&&(t(),y=!1)})}},a.markersEvents={click:function(b,c,d){d.id&&a.$apply(function(){a.selectedMarker=d})},dragend:function(b,c,d){d.id&&a.$apply(function(){d.longitudeOld||(d.longitudeOld=d.longitude,d.latitudeOld=d.latitude),d.longitudeNew=b.position.A,d.latitudeNew=b.position.k,d.longitude=b.position.A,d.latitude=b.position.k})}},a.submit=function(){s()},a.$on("UPDATE_LINEPOINT",function(){l()}),g.setMapZoomLevel(14),v()}]),angular.module("mdToolApp").controller("linePointMarkerWindow",["$scope","eventService",function(a,b){a.test="TEst",a.updateLinePointCoordinates=function(){b.broadcast("UPDATE_LINEPOINT")}}]),angular.module("mdToolApp").factory("apiService",["$http","$window",function(a,b){function c(){var a=b.location.pathname;i="9000"===b.location.port?"https://demodwm3.dilax.com/davisweb/rest/md/":"/"+a.split("/")[1]+"/rest/md/"}function d(b,c){return a.get(i+"raw/"+b,{params:c})}function e(b,c){return a.get(i+"schedule/"+b,{params:c})}function f(b,c){return a.put(i+"schedule/"+b,angular.toJson(c))}function g(b,c){return a.get(i+"count/"+b,{params:c})}function h(b,c){return a.get(i+"match/"+b,{params:c})}var i;return c(),{getRawData:d,getScheduleData:e,putScheduleData:f,getCountData:g,getMatchedData:h}}]),angular.module("mdToolApp").factory("gMapService",function(){function a(){return e}function b(a,b){e.center.latitude=a,e.center.longitude=b}function c(){return e.zoom}function d(a){e.zoom=a}var e={center:{latitude:0,longitude:0},zoom:12,options:{scaleControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},panControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT}},roundMarkers:{black:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-black.png"}},red:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-red.png"}},green:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-green.png"}},blue:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-blue.png"}},orange:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-orange.png"},zIndex:1e4},pink:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-pink.png"}}},pinMarkers:{black:{icon:{anchor:new google.maps.Point(16,32),url:"images/marker-pin-black.png"},zIndex:1e4},blue:{draggable:!0,icon:{anchor:new google.maps.Point(16,32),url:"images/marker-pin-blue.png"},zIndex:1e4}},lines:{black:{color:"#000"},red:{color:"#ce322e"},green:{color:"#169413"},blue:{color:"#2a80af"},orange:{color:"#e47614"},pink:{color:"#c33a77"}},pointMarkerWindow:{pixelOffset:new google.maps.Size(0,-32)}};return{getMapConfig:a,getMapZoomLevel:c,setMapCenter:b,setMapZoomLevel:d}}),angular.module("mdToolApp").factory("sequenceService",["$filter",function(a){function b(b){var c={visible:!1,showStopsInTable:!1,matchingStatus:"Y"===b.hasCntStop?"matched":"unmatched",departureTime:a("timeOnlyFilter")(b.departureAsString),tripKey:b.tripKey||b.cntTripKey,tripLabel:b.tripLabel||b.sclTripLabel,blockLabel:b.sclBlockLabel||void 0,blockKey:b.sclBlockKey||void 0};return c}function c(a){var b={visible:!1,showStopsInTable:!1,lineKey:a.lineKey,lineLabel:a.lineLabel,lineLabelShort:a.lineLabelShort};return b}function d(a,b,c){for(var d=[],e=[],f={},g=-1,h=0;h<a.length;h++)a[h].latitude<1&&a[h].longitude<1?console.log("error: invalid coordinates"):(-1===g&&(f=c(a[h])),-1!==g&&a[h][b]!==g&&(d.push({properties:f,data:e}),e=[],f=c(a[h])),e.push(a[h]),g=a[h][b]);return d.push({properties:f,data:e}),d}function e(a,c){return d(a,c,b)}function f(a,b){return d(a,b,c)}return{createStopSequences:e,createLinePointSequences:f}}]),angular.module("mdToolApp").factory("eventService",["$rootScope",function(a){function b(b,c){console.log("broadcast",b,c),a.$broadcast(b,c)}return{broadcast:b}}]),angular.module("mdToolApp").factory("messagesService",function(){return{messages:{tooManyResults:"Too many results. Please zoom in or select a shorter time period"}}}),angular.module("mdToolApp").factory("helperService",function(){function a(a){var b;return b=a[Math.floor(a.length/2)],{lat:b.latitude,lng:b.longitude}}return{getHalfWayThroughPointOfLine:a}}),angular.module("mdToolApp").directive("accordionHeader",function(){var a="active";return{link:function(b,c){c.bind("click",function(){var b=c.next();b.hasClass(a)?(b.removeClass(a),c.removeClass(a)):(b.addClass(a),c.addClass(a))})}}}),angular.module("mdToolApp").filter("uniqueFilter",function(){return function(a,b){function c(a,b){var c,d=b.split(".");for(c=0;c<d.length;c++)a=a[d[c]];return a}var d,e=[],f={};for(a=a||"",d=0;d<a.length;d++){var g=b?c(a[d],b):a[d];g&&"object"!=typeof g&&(f[g]||(e.push(a[d]),f[g]=!0))}return e}}),angular.module("mdToolApp").filter("timeOnlyFilter",function(){return function(a){var b=a.split(" ");return b[b.length-1]}}),angular.module("mdToolApp").filter("sequenceFilter",function(){return function(a,b,c,d){function e(a,b){var c,d=b.split(".");for(c=0;c<d.length;c++)a=a[d[c]];return a}var f,g=[];for(a=a||"",f=0;f<a.length;f++){var h,i;h=b?e(a[f],b):a[f],h==c&&"object"!=typeof h&&(i=d?e(a[f],d):a[f],g.push(i))}return g}}),angular.module("mdToolApp").directive("stopSequencesTable",function(){return{templateUrl:"templates/stop-sequences-table.html",restrict:"A",scope:{sequences:"="},controller:["$scope","$compile","$http",function(a){a.toggleSequenceDetails=function(a){a.showStopsInTable=!a.showStopsInTable}}]}}),angular.module("mdToolApp").directive("tripsTable",function(){return{templateUrl:"templates/trips-table.html",restrict:"A",scope:{sequences:"="},controller:["$scope","$compile","$http",function(a){a.toggleSequenceDetails=function(a){a.showStopsInTable=!a.showStopsInTable}}]}});