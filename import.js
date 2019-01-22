/*
* import.js
* grab the last column first and combine the middle - issue with file that doesn't escape ,
*/
var fs = require('fs'),
    readline = require('readline'),
    stream = require('stream');

const knex = require('./report/knex');

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " input.csv");
    process.exit(-1);
}

const inputFile = process.argv[2];

var instream = fs.createReadStream(__dirname+'/'+inputFile);
var outstream = new stream;
var isHeaders = false;

var rl = readline.createInterface({
    input: instream,
    output: outstream,
    terminal: false
});

var count=1;
var records=[];
var record = {};
var maxPrice = 0;
var minPrice = 0;
var avgPrice = 0;
var bulkCount =0;
var insertCount =0;

var start = new Date().getTime();

rl.on('line', function(line) {

    var csvLine = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    // console.log(csvLine);

    // csvLine[0] - name - hospital name
    // XXXXXXX - metatitle - procedure
    // csvLine[1] - metadata - procedure
    // csvLine[2] - description - name of operation
    // csvLine[3] - price - price
    // XXXXXXX - if (price == "VARIABLE") = variable=true

    var description = csvLine.slice(2, (csvLine.length-1)).toString().replace(/['"]+/g, '');
    var price = csvLine[csvLine.length-1].replace(/['"]+/g, '');
    var variable = false;

    // check if price is a number not a string (e.g. "VARIBLE")
    // does NOT check if price is rounded or really long
    if(isNaN(parseFloat(price))){
        console.log('ERROR', csvLine);
        price=0;
        variable=true
    }else{
        // cacluate avgPrice (average price)
        avgPrice+=parseFloat(price);
    }

    // cacluate maxPrice
    if(price>maxPrice){
        maxPrice=price;
    }

    // initalize - cacluate minPrice
    if(minPrice==0){
        minPrice=price;
    }

    // cacluate minPrice
    if(price<minPrice){
        minPrice=price;
    }

    // generate ideal record
    if(description!="Procedure Description"){
        record = {
            "name":csvLine[0].replace(/['"]+/g, ''),
            "metatitle": "Procedure number",
            "metadata": csvLine[1].replace(/['"]+/g, ''),
            "description": description,
            "price": price,
            "variable":variable,
            "created_at": new Date()
        }

        records.push(record);
        if(count%5000==0){
            count++;
        }else{
            count++;
        }
    }
});

rl.on('close', function(line) {
    console.log('records', records.length)
    console.log('lines', count)
    // remove last count at end
    avgPrice = (avgPrice/(count-1))

    console.log('maxPrice', maxPrice)
    console.log('minPrice', minPrice)
    console.log('avgPrice', avgPrice)

    var bulkInserts=[];

    for(var i=1;i<=Math.ceil(records.length/5000);i++){
        // console.log(i);
        if(i==1){
            var bulkInsert=records.slice(0,5000)
            bulkInserts.push(bulkInsert)
            insertCount++
        }else{
            var bulkInsert=records.slice((5000*(i-1)),(5000*i))
            bulkInserts.push(bulkInsert)
            insertCount++
        }
        // console.log('*')
    }


    var end = new Date().getTime();
    var time = end - start;
    console.log('Execution time: ' + time);
    console.log('Bulk Inserts: ' + bulkInserts.length);
    console.log('Total Rows: ' + records.length);


    bulkInsertDB(bulkInserts);
    // bulkInserts.filter(function(b, i){
    //     console.log(b);
    //     console.log('--')
    //
    //     knex('chargedata').insert(b, b.length)
    //        .then( function (result) {
    //            console.log("Inserted", i)
    //         })
    //         .catch((e) => {
    //             console.log('e',e)
    //             console.log('Import data failed')
    //             console.log('rlen', records.length);
    //             process.exit(0)
    //         })
    // })

});

async function insertDB(insert, i){
    return new Promise(function (resolve, reject) {
           knex('chargedata').insert(insert, insert.length)
           .then( function (result) {
               // console.log("Inserted", i)
               resolve();
            })
            .catch((e) => {
                console.log('e',e)
                console.log('Import data failed')
                console.log('rlen', records.length);
                reject();
                process.exit(0)
            })
    });
}


async function bulkInsertDB(array) {
    const promises = array.map(insertDB);
    // wait until all promises are resolved
    await Promise.all(promises);
    console.log('Done!');
    process.exit(0);
}
