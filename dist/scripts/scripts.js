"use strict";angular.module("mdToolApp",["ngRoute","google-maps"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/matching-view.html",controller:"matchingViewController"}).when("/sequence-view/:vehicleId/:startTime",{templateUrl:"views/sequence-view.html",controller:"sequenceViewController"}).when("/cluster-view",{templateUrl:"views/cluster-view.html",controller:"clusterViewController"}).otherwise({redirectTo:"/"})}]),angular.module("mdToolApp").controller("matchingViewController",["$scope","$http","$log","apiService","helperService",function(a,b,c,d,e){function f(b){a.spinner[b]=!a.spinner[b]}var g=new Date;g.setDate(g.getDate()-7),a.queryParams={dateFrom:e.yymmddDate(g),dateTo:e.yymmddDate(new Date)},a.selectedTable="vehicles",a.spinner=[!1],a.getMatchedDataLines=function(){d.getMatchedData("lines",a.queryParams).then(function(b){c.info("Lines: ",b.data),a.matchingResultDataLines=b.data})},a.getMatchedDataBlocks=function(){d.getMatchedData("blocks",a.queryParams).then(function(b){c.info("Blocks: ",b.data),a.matchingResultDataBlocks=b.data})},a.getRawData=function(){f(0),d.getRawData("stops/",a.queryParams).then(function(b){f(0),c.info("Stops: ",b.data),a.stopstatisticResultData=b.data})},a.submit=function(){a.getMatchedDataLines(),a.getMatchedDataBlocks(),a.getRawData()},a.getMatchedDataLines(),a.getMatchedDataBlocks(),a.getRawData()}]),angular.module("mdToolApp").controller("sequenceViewController",["$scope","$routeParams","$filter","$log","apiService","sequenceService","gMapService",function(a,b,c,d,e,f,g){function h(b){a.highlightMarker.latitude=b.latitude,a.highlightMarker.longitude=b.longitude,a.highlightMarker.visible=!0}function i(){a.highlightMarker.visible=!0}function j(a){for(var b=0;b<a.length;b++)if(a[b].latitude>0&&a[b].longitude>0){g.setMapCenter(a[b].latitude,a[b].longitude);break}}function k(b){var c=new Date(parseInt(b)).toISOString();a.isoDate=c.split("T")[0]}function l(b){a.spinner[b]=!a.spinner[b]}function m(b){return e.getScheduleData("stops?operationDay="+a.isoDate+"&blockKey="+b)}function n(a){return c("uniqueFilter")(a,"properties.blockLabel")}function o(){l(0),e.getRawData("stops/"+b.vehicleId+"/"+b.startTime+"?dateFrom="+a.isoDate+"&dateTo="+a.isoDate).then(function(b){d.info("getStopsOfSelectedVehicle",b.data),l(0),j(b.data),a.rawStopsSequences=f.createStopSequences(b.data,"cntTripKey"),a.matchingBlocks=n(a.rawStopsSequences),a.selectedMatchingBlock=a.matchingBlocks?a.matchingBlocks[0]:void 0,d.info("$scope.matchingBlocks",a.matchingBlocks)})}function p(){l(2),e.getScheduleData("blocks?operationDay="+a.isoDate).then(function(b){d.info("res.blocksOfDay",b.data),l(2),a.blocksOfDay=b.data})}a.mapConfig=g.getMapConfig(),a.rawStopsSequences=[],a.scheduledStopSequencesOfMatchingBlock=[],a.scheduledStopSequencesOfSelectedBlock=[],a.selectedMatchingBlock=null,a.vehicleId=b.vehicleId,a.spinner=[!1,!1,!1],a.highlightMarker={visible:!1,latitude:51.06093,longitude:13.68995},a.submitBlockForm=function(){l(2),m(a.selectedBlock.blockKey).then(function(b){l(2),d.info("res.getScheduledTripsOfBlock",b.data),a.scheduledStopSequencesOfSelectedBlock=f.createStopSequences(b.data,"tripKey")})},a.showSelectedMatchingBlock=function(){a.selectedMatchingBlock&&a.selectedMatchingBlock.properties&&a.selectedMatchingBlock.properties.blockKey&&(l(1),m(a.selectedMatchingBlock.properties.blockKey).then(function(b){l(1),d.info("res.showSelectedMatchingBlock",b.data),a.scheduledStopSequencesOfMatchingBlock=f.createStopSequences(b.data,"tripKey")}))},a.$watch("selectedMatchingBlock",function(){a.showSelectedMatchingBlock()}),a.$on("HIGHLIGHT_STOP_MARKER",function(a,b){h(b)}),a.$on("DE_HIGHLIGHT_STOP_MARKER",function(){i()}),k(b.startTime),o(),p()}]),angular.module("mdToolApp").controller("clusterViewController",["$scope","$routeParams","$filter","$log","apiService","sequenceService","gMapService","messagesService","helperService",function(a,b,c,d,e,f,g,h,i){function j(){x=c("sequenceFilter")(a.linePointsSequences,"properties.visible",!0,"properties.lineKey")}function k(){var b,d;for(b=0;b<x.length;b++)d=c("sequenceFilter")(a.linePointsSequences,"properties.lineKey",x[b])[0],d.properties.visible=!0}function l(){var b={pointLabel:a.selectedMarker.pointLabel,latitude:a.selectedMarker.latitudeNew,longitude:a.selectedMarker.longitudeNew};j(),b.pointLabel&&b.latitude&&b.longitude?e.putScheduleData("netpoints/update",b).then(function(){v()}):d.error("Error at updateLinePointCoordinates(): missing data")}function m(b){var c=b.getBounds(),d=c.getSouthWest(),e=c.getNorthEast();a.queryParams.lat1=d.lat(),a.queryParams.lon1=d.lng(),a.queryParams.lat2=e.lat(),a.queryParams.lon2=e.lng()}function n(){a.showMap=!0}function o(b){a.spinner[b]=!a.spinner[b]}function p(a){var b=i.getHalfWayThroughPointOfLine(a);g.setMapCenter(b.lat,b.lng)}function q(b){angular.forEach(b,function(b){b&&"Y"===b.hasCntStop?a.stopVariation.matched.push(b):a.stopVariation.unmatched.push(b)})}function r(){g.getMapZoomLevel()<14?(y=!0,g.setMapZoomLevel(14)):s()}function s(){a.stopVariation={matched:[],unmatched:[]},o(0),e.getRawData("stops/scattering"+i.buildQueryString(a.queryParams)).then(function(b){o(0),d.info("stops of bounding box: ",b.data),a.messages.numberOfStops=b.data.length,a.messages.loading="",a.messages.lengthWarning="",b.data.length<a.maxNumberOfStops?(q(b.data),a.messages.lengthWarning=""):a.messages.lengthWarning=h.messages.tooManyResults})}function t(d){var e;g.setMapZoomLevel(14),b.lineKey?(e=c("sequenceFilter")(a.linePointsSequences,"properties.lineKey",b.lineKey)[0],e.properties.visible=!0,p(e.data)):(p(d[0].data),d[0].properties.visible=!0)}function u(b){a.linePointsSequences=f.createLinePointSequences(b,"lineKey"),d.info("linePointSequences",a.linePointsSequences),a.initialState&&(t(a.linePointsSequences),a.initialState=!1),x&&k()}function v(){o(1),a.selectedMarker={},e.getScheduleData("linepoints").then(function(a){u(a.data),o(1),n()})}var w,x,y=!0;a.mapConfig=g.getMapConfig(),a.stopVariation={matched:[],unmatched:[]},a.linePointsSequences=[],a.maxNumberOfStops=5e3,a.showMap=!1,a.initialState=!0,a.showMatchedStopVariation=!0,a.showUnmatchedStopVariation=!0,a.spinner=[!1,!1],a.queryParams={dateFrom:b.dateFrom,dateTo:b.dateTo,lat1:0,lon1:0,lat2:0,lon2:0},a.messages={lengthWarning:"",loading:"",nStops:""},a.mapEvents={dragend:function(a){m(a)},zoom_changed:function(a){m(a)},tilesloaded:function(b){a.$apply(function(){w=b,m(b),y&&(s(),y=!1)})}},a.markersEvents={click:function(b,c,d){d.id&&(a.$apply(function(){a.selectedMarker={}}),a.$apply(function(){a.selectedMarker=d,a.selectedMarker.showWindow=!0}))},dragend:function(b,c,d){d.id&&a.$apply(function(){d.longitudeOld||(d.longitudeOld=d.longitude,d.latitudeOld=d.latitude),d.longitudeNew=b.position.B,d.latitudeNew=b.position.k,d.longitude=b.position.B,d.latitude=b.position.k})}},a.submitForm=function(){r()},a.$on("UPDATE_LINEPOINT",function(){l()}),v()}]),angular.module("mdToolApp").controller("linePointMarkerWindow",["$scope","eventService",function(a,b){a.updateLinePointCoordinates=function(){b.broadcast("UPDATE_LINEPOINT")}}]),angular.module("mdToolApp").controller("tableController",["$scope","eventService",function(a,b){a.toggleSequenceDetails=function(a){a.showStopsInTable=!a.showStopsInTable},a.onMouseOverStopRow=function(a,c,d){a&&b.broadcast("HIGHLIGHT_STOP_MARKER",{latitude:c,longitude:d})},a.onMouseOutStopRow=function(a){a&&b.broadcast("DE_HIGHLIGHT_STOP_MARKER")}}]),angular.module("mdToolApp").factory("apiService",["$http","$window",function(a,b){function c(){var a=b.location.pathname;i="9000"===b.location.port?"https://demodwm3.dilax.com/davisweb/rest/md/":"/"+a.split("/")[1]+"/rest/md/"}function d(b,c){return a.get(i+"raw/"+b,{params:c})}function e(b,c){return a.get(i+"schedule/"+b,{params:c})}function f(b,c){return a.put(i+"schedule/"+b,angular.toJson(c))}function g(b,c){return a.get(i+"count/"+b,{params:c})}function h(b,c){return a.get(i+"match/"+b,{params:c})}var i;return c(),{getRawData:d,getScheduleData:e,putScheduleData:f,getCountData:g,getMatchedData:h}}]),angular.module("mdToolApp").factory("gMapService",function(){function a(){return e}function b(a,b){e.center.latitude=a,e.center.longitude=b}function c(){return e.zoom}function d(a){e.zoom=a}var e={center:{latitude:0,longitude:0},zoom:12,options:{scaleControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},panControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT}},roundMarkers:{black:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-black.png"},optimized:!1,zIndex:10},red:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-red.png"},optimized:!1,zIndex:10},green:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-green.png"},optimized:!1,zIndex:10},blue:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-blue.png"},optimized:!1,zIndex:10},orange:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-orange.png"},optimized:!1,zIndex:10},pink:{icon:{anchor:new google.maps.Point(6,6),url:"images/marker-round-pink.png"},optimized:!1,zIndex:10},highlighted:{icon:{anchor:new google.maps.Point(12,12),url:"images/marker-round-small-highlighted.png"},optimized:!1,zIndex:100}},pinMarkers:{black:{icon:{anchor:new google.maps.Point(16,32),url:"images/marker-pin-black.png"},zIndex:1e4},blue:{draggable:!0,icon:{anchor:new google.maps.Point(16,32),url:"images/marker-pin-blue.png"},zIndex:1e4}},lines:{black:{color:"#000"},red:{color:"#ce322e"},green:{color:"#169413"},blue:{color:"#2a80af"},orange:{color:"#e47614"},pink:{color:"#c33a77"}},pointMarkerWindow:{pixelOffset:new google.maps.Size(0,-32)}};return{getMapConfig:a,getMapZoomLevel:c,setMapCenter:b,setMapZoomLevel:d}}),angular.module("mdToolApp").factory("sequenceService",["$filter","$log",function(a,b){function c(b){var c={visible:!1,showStopsInTable:!1,matchingStatus:"Y"===b.hasCntStop?"matched":"unmatched",departureTime:a("timeOnlyFilter")(b.departureAsString),tripKey:b.tripKey||b.cntTripKey,tripLabel:b.tripLabel||b.sclTripLabel,blockLabel:b.sclBlockLabel||void 0,blockKey:b.sclBlockKey||void 0};return c}function d(a){var b={visible:!1,showStopsInTable:!1,lineKey:a.lineKey,lineLabel:a.lineLabel,lineLabelShort:a.lineLabelShort};return b}function e(a,c,d){for(var e=[],f=[],g={},h=-1,i=0;i<a.length;i++)a[i].latitude<1&&a[i].longitude<1?b.info("sequenceService: found invalid coordinates"):(-1===h&&(g=d(a[i])),-1!==h&&a[i][c]!==h&&(e.push({properties:g,data:f}),f=[],g=d(a[i])),f.push(a[i]),h=a[i][c]);return e.push({properties:g,data:f}),e}function f(a,b){return e(a,b,c)}function g(a,b){return e(a,b,d)}return{createStopSequences:f,createLinePointSequences:g}}]),angular.module("mdToolApp").factory("eventService",["$rootScope","$log",function(a){function b(b,c){a.$broadcast(b,c)}return{broadcast:b}}]),angular.module("mdToolApp").factory("messagesService",function(){return{messages:{tooManyResults:"Too many results. Please zoom in or select a shorter time period"}}}),angular.module("mdToolApp").factory("helperService",function(){function a(a){var b;return b=a[Math.floor(a.length/2)],{lat:b.latitude,lng:b.longitude}}function b(a){var b="?";return angular.forEach(a,function(a,c){b=b+c+"="+a+"&"}),b}function c(a){return String("0"+a).slice(-2)}function d(a){return a.getFullYear()+"-"+c(a.getMonth()+1)+"-"+c(a.getDate())}return{getHalfWayThroughPointOfLine:a,buildQueryString:b,yymmddDate:d}}),angular.module("mdToolApp").directive("accordionDirective",function(){var a="active";return{link:function(b,c){c.bind("click",function(){var b=c.next();b.hasClass(a)?(b.removeClass(a),c.removeClass(a)):(b.addClass(a),c.addClass(a))})}}}),angular.module("mdToolApp").directive("stopsTableDirective",function(){return{templateUrl:"partials/stops-table.html",restrict:"A",scope:{sequences:"="},controller:"tableController"}}),angular.module("mdToolApp").directive("tripsTableDirective",function(){return{templateUrl:"partials/trips-table.html",restrict:"A",scope:{sequences:"="},controller:"tableController"}}),angular.module("mdToolApp").filter("uniqueFilter",function(){return function(a,b){function c(a,b){var c,d=b.split(".");for(c=0;c<d.length;c++)a=a[d[c]];return a}var d,e=[],f={};for(a=a||"",d=0;d<a.length;d++){var g=b?c(a[d],b):a[d];g&&"object"!=typeof g&&(f[g]||(e.push(a[d]),f[g]=!0))}return e}}),angular.module("mdToolApp").filter("timeOnlyFilter",function(){return function(a){var b=a.split(" ");return b[b.length-1]}}),angular.module("mdToolApp").filter("sequenceFilter",function(){return function(a,b,c,d){function e(a,b){var c,d=b.split(".");for(c=0;c<d.length;c++)a=a[d[c]];return a}var f,g=[];for(a=a||"",f=0;f<a.length;f++){var h,i;h=b?e(a[f],b):a[f],h==c&&"object"!=typeof h&&(i=d?e(a[f],d):a[f],g.push(i))}return g}});