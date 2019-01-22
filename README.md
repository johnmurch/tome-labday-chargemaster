# tome-labday-chargemaster

Import script for chargemaster files from hospitals

## Overview

I wanted to look at chargemaster files from local Pittsburgh hospitals, specifically from the Allegheny Health Network (AHN).

Quick description of each file in repo

1.   excel2csv.js - converst excel files (.xlsx) to Comma Seperated Values (.csv).

2.   import.js - Takes a (.csv) file and imports into postgres database using knex.js.

3. batch_ahn.sh - runs import.js on each of the CSV files in the process folder

4. Folders - I dumped the current data in /raw/ahn and use excel2csv.js to convert to /process/ahn

5. /import - This is the knex.js setup for basic ETL of csv's to postgres.

Please adjust settings and run `knex migrate:latest`
```
/import/knex.js
```

Note that in db/migrations you can see the basic structure of the table
* id `autoincrement`
* name `hospital name`
* metatitle `naming for additional data`
* metadata `way to store additional data`
* description `details of charge`
* price `note this is a raw price as some files do not round to hundredths place`
* variable `note if the price is NaN`
* created_at `when imported`


## Take away

1. There is no standard format for chargemaster files from hospitals. Some even offer `machine readable` which is a (.xlsx) file 🤦‍♂️

2. Pricing is still funny as it's "cash" pricing, but no one pays "cash" pricing and even if you tried, the hospital would easily knock off some % for discount.

3. Pricing transparency - this is a good start, but very disappointing. Really wish healthcare was taken more serious in the USA.
