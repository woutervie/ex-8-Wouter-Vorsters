// >$ npm install request --save 
var request = require("request");
var dal = require('./storage.js');

// http://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var BASE_URL = "https://web-ims.thomasmore.be/datadistribution/API/2.0";
var Settings = function (url) {
	this.url = BASE_URL + url;
	this.method = "GET";
	this.qs = {format: 'json'};
	this.headers = {
		authorization: "Basic aW1zOno1MTJtVDRKeVgwUExXZw=="
	};
};

var Drone = function (id, name, mac) {
	this._id = id;
	this.name = name;
	this.mac = mac;
};

var File = function (id, drone_ref) {
    this.id = id;
    this.drone_ref = drone_ref;
};

var dronesSettings = new Settings("/drones?format=json");

dal.clearDrone();
dal.clearFile();

request(dronesSettings, function (error, response, dronesString) {
	var drones = JSON.parse(dronesString);
	console.log(drones);
	console.log("***************************************************************************");
	drones.forEach(function (drone) {
		var droneSettings = new Settings("/drones/" + drone.id + "?format=json");
		request(droneSettings, function (error, response, droneString) {
			var drone = JSON.parse(droneString);
			dal.insertDrone(new Drone(drone.id, drone.name, drone.mac_address));
                        var fileSettings = new Settings("/files?drone_id.is=" + drone.id + "&format=json&date_loaded.greaterOrEqual=2016-12-15");
                        request(fileSettings, function (error, response, filesString) {
                            var files = JSON.parse(filesString);
                            files.forEach(function(file){
                                //console.log(file);
                                dal.insertFile(new File(file.id, file.ref));
                            });
                        });
		});
	});
});

// FILTER URL https://web-ims.thomasmore.be/datadistribution/API/2.0/files?drone_id.is=55cd4bd60ec0441e81982bf846f41965&format=json&date_loaded.greaterOrEqual=2016-12-21

// BACKUP
//request(dronesSettings, function (error, response, dronesString) {
//	var drones = JSON.parse(dronesString);
//	console.log(drones);
//	console.log("***************************************************************************");
//	drones.forEach(function (drone) {
//		var droneSettings = new Settings("/drones/" + drone.id + "?format=json");
//		request(droneSettings, function (error, response, droneString) {
//			var drone = JSON.parse(droneString);
//			dal.insertDrone(new Drone(drone.id, drone.name, drone.mac_address));
//		});
//	});
//});

console.log("Hello World!");