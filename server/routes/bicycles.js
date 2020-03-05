var express = require('express');
var turf = require('@turf/turf')
var router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');

const response = {
    data:[]
}

router.get('/', async(req, res, next) => {
    response.data = []

    // "Fake request to database"
    // I use csv as data storage
    fs.createReadStream('data.csv')
        .pipe(csv())
        .on('data', (row) => {
            let bicycle = {
                id: parseInt(row.id),
                coordinates: [parseFloat(row.lon),parseFloat(row.lat)]
            }
            response.data.push(bicycle)
        })
        .on('end', () => {
            res.send(response);
        });
});


router.get('/proximity', function(req, res, next) {
    // Note - req.query gives me all the parameters (scooters, lon,lat and metres)

    // coordinate - 1st long, 2nd lat
    let selectedPoint = turf.point([parseFloat(req.query.lon),parseFloat(req.query.lat)])

    const scooters = response.data
    scooters.forEach((scooter,index) => {
        let scooterPoint = turf.point(scooter.coordinates)
        let distance = turf.distance(selectedPoint,scooterPoint,{units:"kilometers"}) // calculate the distance between the points
        scooter.distance = distance
    })

    distanceBic = scooters.filter((scooter) => scooter.distance <= parseFloat(req.query.metres/1000)) // remove all bicycle that is over the defined metres

    sortedBic = distanceBic.sort((a,b) => (a.distance > b.distance) ? 1 : -1) // sort bicycle's distance in ascending order

    // cater case when requested scooters is more than the scooters on the map(or "database")
    let lastCount = 0
    if (parseFloat(req.query.scooters) > sortedBic.length){
        lastCount = sortedBic.length
    }else{
        lastCount = parseFloat(req.query.scooters)
    }
   
    // get the top Y of scooters 
    slicedBic = sortedBic.slice(0, lastCount)

    const results = {
        data: slicedBic
    }

    res.send(results);
});

module.exports = router;