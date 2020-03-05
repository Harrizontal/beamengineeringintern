import React, {useState, useEffect, useRef} from 'react';
import Map from './Map'
import './App.css';
import styled from 'styled-components'
import { useSelector,useDispatch } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import 'mapbox-gl/dist/mapbox-gl.css';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`

function App() {
  const [scooters,setScooters] = useState(2)
  const [metres,setMetres] = useState(4000)
  const inputLon = useRef(null);
  const inputLat = useRef(null);

  const dispatch = useDispatch()
  const [error,setErrors] = useState(false)
  const [scootersData, setScootersData] = useState([])
  const [nearScootersData, setNearScootersData] = useState([])
  const point_coordinates = useSelector(state => state.selectedPointCoordinates)

  // fetch bicycle data on load
  async function fetchData(){
    const res = await fetch("http://localhost:8000/scooters")
    res.json().then(res => setScootersData(res.data)).catch(err => setErrors(err))
  }

  useEffect(() => {
    fetchData();
  },[])

  // click on "Get nearest scooters" button
  const handleClickProximity = () => {
    async function fetchProx(){
      // pass in user's input on scooters, metres, coordinates (lon and lat) to get request api
      const res = await fetch(`http://localhost:8000/scooters/proximity?scooters=${parseInt(scooters)}&metres=${parseFloat(metres)}&lon=${point_coordinates[0]}&lat=${point_coordinates[1]}`)
      res.json().then(res => setNearScootersData(res.data)).catch(err => setErrors(err))
    }

    fetchProx();
  }

  const handleLonLatChange = () => {
    // update selected coordinates in the store
    dispatch({
      type: "EDIT_POINT",
      coordinates: [inputLon.current.value,inputLat.current.value]
    })
  }


  // could use styled components to style it...
  return (
    <Wrapper>
      <div style={{width: "50vw",height:"100vh"}}>
        <Card style={{margin:"10px"}}>
          <Card.Header>Find nearest scooters</Card.Header>
          <Card.Body>
                <Form.Group controlId="formScooters">
                  <Form.Label>Scooters</Form.Label>
                  <Form.Control size="sm" type="text" value={scooters} onChange={e => setScooters(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formMetres">
                  <Form.Label>Metres</Form.Label>
                  <Form.Control size="sm" type="text" value={metres} onChange={e => setMetres(e.target.value)}/>
                </Form.Group>
                
                <Form.Row>
                  <Form.Group as={Col} controlId="formLon">
                    <Form.Label>Lon</Form.Label>
                    <Form.Control size="sm" type="text" placeholder="5" value={point_coordinates[0]} ref={inputLon} onChange={handleLonLatChange}/>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formLat">
                    <Form.Label>Lat</Form.Label>
                    <Form.Control size="sm" type="text" placeholder="5" value={point_coordinates[1]} ref={inputLat} onChange={handleLonLatChange}/>
                  </Form.Group>
                </Form.Row>
                <Button style={{marginLeft:"1%"}} size="small" onClick={handleClickProximity}>Get nearest scooters</Button>
          </Card.Body>
        </Card>
        <Table responsive="sm" striped bordered size="sm" style={{width:"95%",margin:"10px"}}>
          <thead>
            <tr>
              <th>#</th>
              <th>Scooter Id</th>
              <th>Distance(m)</th>
            </tr>
          </thead>
          <tbody>
            {
              // just putting data into a table format
              nearScootersData.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{value.id}</td>
                    <td>{Math.round(value.distance * 1000)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
      <div style={{width: "50vw",height: "auto",margin: "10px"}}>
        <Map scootersData={scootersData} nearestScootersData ={nearScootersData}/>
      </div>
    </Wrapper>
  );
}

export default App;
