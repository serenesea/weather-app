import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, ListGroup, ListGroupItem, Grid, Row, Col } from "react-bootstrap";
import injectTapEventPlugin from 'react-tap-event-plugin'
/*
import { createStore, combineReducers } from 'redux';
*/

injectTapEventPlugin();


const FIELDSNAME = [
    "Amount of total cloud",
    "Dewpoint",
    "Feel like temperature",
    "Humidity level",
    "Sea level pressure",
    "Visibility",
    "Direction wind is coming from",
    "Maximum mean wind speed"]


class WeatherLine extends Component {
    render() {
        return (
            <div>
                <ListGroupItem className="Description">
                    {this.props.desc}
                </ListGroupItem>
                <div className="Field">
                    {this.props.fields}
                </div>
            </div>
        );
    }
}

class Header extends Component {
    render(){
        return(
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        Weather App
                    </Navbar.Brand>
                </Navbar.Header>
            </Navbar>
        )
    }
}
class WeatherDisplay extends Component {
    constructor() {
        super();
        this.state = {
            weatherData: null,
/*
            seconds: 0
*/
        };
    }
    componentDidMount(){
        const GEOURL ="http://api-maps.yandex.ru/2.1/?lang=ru_RU";
        const URL = "http://api.weatherunlocked.com/api/trigger/-7.33,72.42/" +
            "current temperature gt 16 includecurrent?" +
            "app_id=30cd5553&app_key=18c2693430a2fc4f7d628166efefa475";

            fetch(URL).then(res => res.json()).then(json => {
                this.setState({weatherData: json});
            });
/*
        let timer = setInterval(this.tick, 10000)
*/

    }
   /* tick() {
        this.setState({ seconds: this.state.seconds + 1 });
        console.log(this.state.seconds);
    }*/

    componentWillUnmount() {
        clearInterval(this.timer);
    };

    render() {
        const weatherData = this.state.weatherData;
        if (!weatherData) return <div> Loading...</div>;
        const weather = weatherData.CurrentWeather;
        const iconPath = "img/set/"+weather.wx_icon.replace("gif","png");
        const date = new Date().toLocaleDateString();
        return (
            <div className="container">
                    <Row className="CityAndDate">
                        <Col md={6} className="City">
                            <h1> at latitude {weather.lat} and longitude {weather.lon}</h1>
                        </Col>
                        <Col md={6} className="Date">
                            <h1>{date}</h1>
                        </Col>
                    </Row>

                    <Row className="WeatherInfo">
                        <Col md={4}>
                            <div className="ShortInfo">
                                <div className="Image"><img src={iconPath} alt={weather.wx_desc}/></div>
                                <div className="WeatherDesc">{weather.wx_desc}</div>
                                <div className="Temperature">{weather.temp_c}°</div>
                            </div>
                        </Col>

                        <Col md={4} className="GeneralInfo">

                            <ListGroup>
                                <div>
                                    { FIELDSNAME.map(function (el, index) {
                                        return (
                                            <WeatherLine
                                                key={index}
                                                desc={el}/>
                                                )
                                        })
                                    }
                                </div>
                            </ListGroup>
                        </Col>
                        <Col md={4}>
                            <div>
                                <ListGroup className="fields">
                                    <ListGroupItem> {weather.cloudtotal_pct}%</ListGroupItem>
                                    <ListGroupItem> {weather.dewpoint_c}°  </ListGroupItem>
                                    <ListGroupItem> {weather.feelslike_c}°</ListGroupItem>
                                    <ListGroupItem> {weather.humid_pct}%  </ListGroupItem>
                                    <ListGroupItem> {weather.slp_in} inches</ListGroupItem>
                                    <ListGroupItem> {weather.vis_km} kilometers</ListGroupItem>
                                    <ListGroupItem> {weather.winddir_deg} degrees</ListGroupItem>
                                    <ListGroupItem> {weather.windspd_kmh} km/h</ListGroupItem>
                                </ListGroup>
                            </div>
                        </Col>
                    </Row>
            </div>
        );
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
      render() {
        return (
            <div className="App">
                <Header />
                <WeatherDisplay />
            </div>
    );
  }
}

/*
setInterval(promise(), 1000);
*/


export default App;
