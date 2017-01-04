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
    this._id = id;
    this.id = id;
    this.drone_ref = drone_ref;
};

//var Content = function (id, drone_ref) {
//    this._id = id;
//    this.id = id;
//    this.drone_ref = drone_ref;
//};

var dronesSettings = new Settings("/drones?format=json");

dal.clearDrone();
dal.clearFile();
//dal.clearContent();

request(dronesSettings, function (error, response, dronesString) {
	var drones = JSON.parse(dronesString);
	//console.log(drones);
	//console.log("***************************************************************************");
	drones.forEach(function (drone) {
		var droneSettings = new Settings("/drones/" + drone.id + "?format=json");
		request(droneSettings, function (error, response, droneString) {
			var drone = JSON.parse(droneString);
			dal.insertDrone(new Drone(drone.id, drone.name, drone.mac_address));
                        
                        var fileSettings = new Settings("/files?drone_id.is=" + drone.id + "&format=json&date_loaded.greaterOrEqual=2016-12-15");
                        request(fileSettings, function (error, response, filesString) {
                            var files = JSON.parse(filesString);
                            files.forEach(function(file){
                                dal.insertFile(new File(file.id, file.ref));
                                
                                var contentSettings = new Settings("/files/" + file.id + "/contents?format=json");
                                //console.log(contentSettings.url);
                                request(contentSettings, function (error, response, contentsString) {
                                    console.log(contentString);
                                    //var contents = JSON.parse(contentsString);
//                                    
//                                    contents.forEach(function(content) {
//                                        var contentSettings = new Settings("/" + content.ref + "/contents/" + content.id + "?format=json");
//                                        
//                                        request(contentSettings, function (error, response, contentString) {
//                                        var content = JSON.parse(contentString);
//                                        console.log(content);                                        
//                                                                               
//                                        });
//                                    });                                  
                                });
                            });
                        });
		});
	});
});

// FILTER URL https://web-ims.thomasmore.be/datadistribution/API/2.0/files?drone_id.is=55cd4bd60ec0441e81982bf846f41965&format=json&date_loaded.greaterOrEqual=2016-12-21


console.log("Hello World!");