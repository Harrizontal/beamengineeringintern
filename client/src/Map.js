import React, {Component} from "react";
import DeckGL from "@deck.gl/react";
import {ScatterplotLayer} from '@deck.gl/layers';
import { StaticMap } from "react-map-gl";
import { EditableGeoJsonLayer } from 'nebula.gl';
import { connect } from "react-redux";

// my mapbox access token... You can get your own key at mapbox.com! :)
const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiaGFycml6b250YWwiLCJhIjoiY2l6YWw3YW90MDQ1NzJ3cDl5bXd4M2Y4aSJ9.CnTz5K2ShZcuLiG0xYLBKw";

// pointing to singapore's position
const initialViewState = {
    longitude: 103.85425474373285,
    latitude: 1.2965813677839373,
    zoom: 15,
    pitch: 0,
    bearing: 0
};

// redux
function mapStateToProps(state) {
    return {
        map: state
    };
}

class Map extends Component {
    constructor(props){
        super(props);
        this.state = {
            bicycles: [],
            nearestBicycles: [],
            selectedPointGeoJSON: {
                type: 'FeatureCollection',
                features: []
            }
        }
    }
    
    
    componentWillReceiveProps(nextProps){
        // update state when there is new data
        this.setState({bicycles: nextProps.scootersData,
                        nearestBicycles: nextProps.nearestScootersData,
                        selectedPointGeoJSON: nextProps.map.selectedPointGeoJSON})
    }

    _renderTooltip() {
        const {hoveredObject, pointerX, pointerY} = this.state || {};
        return hoveredObject && (
            <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: pointerX, top: pointerY}}>
                <p style={{margin:0,padding:0}}><b>Bicycle {hoveredObject.id} </b></p>
            </div>
        )
    }


    selectPointOnMap = (data) => {
        const {dispatch} = this.props;
        let f = data.features[data.features.length - 1]
        let newFeatureCollection = {
            type: 'FeatureCollection',
            features: [f]
        }
        // when user select a point in the map (black dot), update the coordinates in the store
        dispatch({
            type: "SELECT_POINT",
            coordinates: f.geometry.coordinates,
            geojson: newFeatureCollection
        })
       
    }

    render(){
        const layers = [
            new ScatterplotLayer({
                id: 'bicycle-scatter-layer',
                data: this.state.bicycles,
                pickable: true,
                opacity: 1,
                radiusMinPixels: 5,
                radiusMaxPixels: 10,
                getPosition: b => [b.coordinates[0], b.coordinates[1]],
                getFillColor: [116,74,255],
                getRadius: 5,
                onHover: info => this.setState({
                    hoveredObject: info.object,
                    pointerX: info.x,
                    pointerY: info.y
                  })
            }),
            new ScatterplotLayer({
                id: 'near-bicycle-scatter-layer',
                data: this.state.nearestBicycles,
                pickable: true,
                opacity: 0.8,
                radiusMinPixels: 5,
                radiusMaxPixels: 10,
                getPosition: b => [b.coordinates[0], b.coordinates[1]],
                getFillColor: [252, 3, 28],
                getRadius: 5,
                onHover: info => this.setState({
                    hoveredObject: info.object,
                    pointerX: info.x,
                    pointerY: info.y
                  })
            }),
            new EditableGeoJsonLayer({
                id: 'geojson-layer',
                data: this.state.selectedPointGeoJSON,
                mode: 'drawPoint',
                onEdit: ({updatedData})=>{
                    this.selectPointOnMap(updatedData)
                }
            })
        ];
      
        return (
            <React.Fragment>
                <div style={{width: "100%", height: "100%",position: "relative"}}>
                    <DeckGL
                        width="100%"
                        height="100%"
                        initialViewState={initialViewState}
                        controller={true}
                        layers={layers}
                    >
                        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}/>
                    </DeckGL>
                    { this._renderTooltip() }
                </div>
                    
                
            </React.Fragment>
        )
    }
}

export default connect(mapStateToProps)(Map)