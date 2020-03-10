## Update
Rejected due to not optimizing search and not clean code.

## Preview
![Preview](https://i.gyazo.com/3edeaead3bc2d3c6c63505e776c34691.gif)
## How it works?

- Enter the no. of scooter and the metres from the defined location.
- To set the location, you can manually enter lon and lat, or tap on the map.
- Click on the button to get the results
- Purple dots stands for Scooters
- Red dots stands for nearest scooters based on the defined parameters

## Instructions

Execute the commands below for /client and /server
```
npm install
npm start
```

Best is to start the server first, and then the client side, and access http://localhost:3000/.
Take note that the server is running at 8000.

## Technology used
Front end
- ReactJS
- Redux
- React Mapbox Gl, Deck GL and Nebula GL
- React Bootstrap and Styled Component for UI

Back end
- Express
- Turf (geospatial analysis)

Data Storage
- CSV

## Data format
Data stored in a csv. (See data.csv in server folder).
Data format is id, lon, lat.
Ensure that the id is unique.

Thank you :)