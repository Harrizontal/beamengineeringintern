

const initialState = {
    selectedPointCoordinates: [103.85425474373285,37.78612883035061],
    selectedPointGeoJSON: {
        type: 'FeatureCollection',
        features: [{
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: [103.85425474373285,1.2965813677839373]
            }
        }]
    }
}

export default function rootReducer(state = initialState, action){
    switch(action.type){
        case 'SELECT_POINT':
            let pointGeoJson = {
                type: 'FeatureCollection',
                features: [{
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Point",
                        coordinates: action.coordinates
                    }
                }]
            }
            return {
                ...state,
                selectedPointCoordinates: action.coordinates,
                selectedPointGeoJSON: pointGeoJson
            }
        case 'EDIT_POINT':
            let emptyGeoJson = {
                type: 'FeatureCollection',
                features: [{
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Point",
                        coordinates: [parseFloat(action.coordinates[0]),parseFloat(action.coordinates[1])]
                    }
                }]
            }
            return{
                ...state,
                selectedPointCoordinates: action.coordinates,
                selectedPointGeoJSON: emptyGeoJson
            }
        case 'DELETE_POINT':
            return {
                ...state,
                selectedPointCoordinates: null,
                selectedPointGeoJSON: null
            }
        default:
            return state
    }
}