var parser = require("xml2json");
var fs = require("fs");
var json2json = require("node-json2json");

var xmlcontent = "";

fs.readFile("result_items.xml","utf8", function(err, data) {
	if (err) {
		throw err;
	}
	xmlcontent = data.toString();
	//console.log(xmlcontent);
	var json = parser.toJson(xmlcontent);
	//console.log(json);
	fs.writeFileSync("result_items.json",json,"utf8");
	//var filecontentnew= fs.readFileSync("result_items.json","utf8");
	var newdata = JSON.parse(json);
	var newfilestring = "";
	for (var i = 0; i < newdata.dataset.RESULT.length; ++i)
	{
	//	console.log(newdata.dataset.RESULT[i].id + " " + newdata.dataset.RESULT[i].ITMREF + " " + newdata.dataset.RESULT[i].DESC + " " + newdata.dataset.RESULT[i].PRICE);
		newfilestring += '{ "delete" : { "_index" : "product" , "_type" : "drug", "_id" : "' + newdata.dataset.RESULT[i].id + '" } }\n';
		//newfilestring += '{ "id" : "' + newdata.dataset.RESULT[i].id + '", "ITMREF" : "' + newdata.dataset.RESULT[i].ITMREF + '", "DESC" : "' + newdata.dataset.RESULT[i].DESC + '", "PRICE" : "' + newdata.dataset.RESULT[i].PRICE + '" }\n';
	}
	fs.writeFileSync("delete.json",newfilestring,"utf8");
});

fs.readFile("result_countperday.xml","utf8",function(err, data)
{
	if (err)
	{
		throw err;
	}
	xmlcontent = data.toString();
	var json = parser.toJson(xmlcontent);
	//json = JSON.parse(json);
	fs.writeFileSync("result_quantities.json",json,"utf8");
	var newfilestring = "";
	var newdata = JSON.parse(json);
	for (var i = 0; i < newdata.dataset.RESULT.length; ++i)
	{
		var date = new Date(newdata.dataset.RESULT[i].DATE);
		newfilestring += newdata.dataset.RESULT[i].ID + "\t" + newdata.dataset.RESULT[i].ITMREF + "\t" + newdata.dataset.RESULT[i].QTYORD + "\t" + newdata.dataset.RESULT[i].Date+ "\n";
	}
	fs.writeFileSync("quantities.dat",newfilestring,"utf8");
});
