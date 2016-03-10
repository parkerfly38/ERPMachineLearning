//create our elasticsearch client
var elasticsearch = require("elasticsearch");
var connectionString = "localhost:9200";

///create our webserver
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;

var client = new elasticsearch.Client({ host: connectionString, log: "trace"});

//do this and look for our path
http.createServer(function(request,response){
	//get request to create our search - we know the base id they're looking at on our system so we're going to use that to check our indicators
	var searchLookup = url.parse(request.url).pathname;
	if (searchLookup.charAt(0) === '/')
		searchLookup = searchLookup.slice(1);
	console.log(searchLookup);
	getSearch(searchLookup).then(function(result) { 
		response.writeHead(200, {"Content-Type":"application/json"});
		response.write(JSON.stringify(result.hits));
		response.end();
	});
}).listen(parseInt(port,10));


function getSearch(input)
{
	return client.search({
		index: "product",
		type: "drug",
		body: {
			query: {
				bool : {
					must : [ { match : { "indicators" : input }}],
					must_not : [ {"ids" : { values: [input]}}]
				}
			}
		}
	});
}