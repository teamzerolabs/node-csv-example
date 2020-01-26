// Shows how to parse existing csv files into node data structure
// Source: https://support.spatialkey.com/spatialkey-sample-csv-data/

console.log(`Hello, in this script, we will:
 1. load data from Sacramentorealestatetransactions.csv
 2. Parse it into json record (input)
 3. Write it back out into another csv file (output)`);

// Input

const neatCsv = require("neat-csv");

// https://mircozeiss.com/json2csv/
const { parseAsync } = require("json2csv");

const fs = require("fs");
const csv = fs.readFileSync("./Sacramentorealestatetransactions.csv");

async function readCSV() {
  return neatCsv(csv);
}

async function main() {
  const result = await readCSV();

  // Uncomment this line to see what an individual record looks like.
  // console.log(result);

  /*
  An array of object record like the following:

  { street: '4900 71ST ST',
    city: 'SACRAMENTO',
    zip: '95820',
    state: 'CA',
    beds: '3',
    baths: '1',
    sq__ft: '1018',
    type: 'Residential',
    sale_date: 'Wed May 21 00:00:00 EDT 2008',
    price: '260014',
    latitude: '38.53151',
    longitude: '-121.421089' }

   */

  result.forEach(record => {
    record.zip = parseFloat(record.zip);
    record.sq__ft = parseFloat(record.sq__ft);
    record.baths = parseFloat(record.baths);
    record.beds = parseFloat(record.beds);
    record.price = parseFloat(record.price);
    record.latitude = parseFloat(record.latitude);
    record.longitude = parseFloat(record.longitude);
  });

  // Next we will convert it back into a csv file.
  // Let's keep only sqft, price, and zip
  const fields = [
    "zip",
    {
      label: "sqft",
      value: "sq__ft"
    },
    "price"
  ];
  const opts = { fields };

  const resultCSV = await parseAsync(result, opts);
  fs.writeFileSync("./cleanedup.csv", resultCSV);
}

main()
  .then(() => console.log("All done!"))
  .catch(err => {
    console.error(err.message);
  });
