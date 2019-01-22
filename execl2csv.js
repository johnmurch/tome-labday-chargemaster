/*
* excel2csv.js
* Takes a excel (xlsx) file and converts it to CSV
*/
var xlsx = require('node-xlsx');
var fs = require('fs');

if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " your_excel_file.xls output_csv_file.csv");
    process.exit(-1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

var obj = xlsx.parse(__dirname + '/'+inputFile); // parses a file
var rows = [];
var writeStr = "";

//looping through all sheets
for(var i = 0; i < obj.length; i++)
{
    var sheet = obj[i];
    //loop through all rows in the sheet
    for(var j = 0; j < sheet['data'].length; j++)
    {
            //add the row to the rows array
            rows.push(sheet['data'][j]);
    }
}

//creates the csv string to write it to a file
for(var i = 0; i < rows.length; i++)
{
    writeStr += rows[i].join(",") + "\n";
}

//writes to a file, but you will presumably send the csv as a
//response instead
fs.writeFile(__dirname + "/"+outputFile, writeStr, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("file was saved in the current directory!");
});
