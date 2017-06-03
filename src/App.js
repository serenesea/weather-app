import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, ListGroup, ListGroupItem, Grid, Row, Col, ProgressBar } from "react-bootstrap";


/*const FIELDSNAME = [
    {"cloudtotal_pct" : "Amount of total cloud"},
   { "dewpoint_c":"Dewpoint"},
    {"feelslike_c":"Feel like temperature"},
    {"humid_pct":"Humidity level"},
    {"slp_mb":"Sea level pressure"},
    {"vis_km":"Visibility"},
    {"winddir_deg":"Direction wind is coming from"},
    {"windspd_kts":"Maximum mean wind speed"}]*/
const FIELDSNAME = [
    "Amount of total cloud",
    "Dewpoint",
    "Feel like temperature",
    "Humidity level",
    "Sea level pressure",
    "Visibility",
    "Direction wind is coming from",
    "Maximum mean wind speed"]

//component, showing single line of weather info
/*class WeatherLine extends React.Component {
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
}*/
//component-header
class Header extends React.Component {
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
//component for showing loading process if weather==nul, ex.at the start of App
class WeatherLoading extends React.Component {
    render(){
        return(
            <div>
                Loading...
            </div>
        )
    }
}
class WeatherDisplay extends React.Component {
    constructor() {
        super();
        this.state = {                              //initialize state of component here
            weatherData: null,
            seconds: 0
        };
    }

    //Make request to API after component is mounted
    //Create setInterval to get response/refresh info with an interval of 1 minute
    //use .bind(this) to be able to use this.setState as setInterval() has it's own/different contex
    //Use constant url for getting data about weather for today in Tel-Aviv

    componentDidMount(){
        URL = "http://api.weatherunlocked.com/api/trigger/-7.33,72.42/" +
            "current temperature gt 16 includecurrent?" +
            "app_id=30cd5553&app_key=18c2693430a2fc4f7d628166efefa475";
        fetch(URL).then(res => res.json()).then(json => {
            this.setState({weatherData: json})
        });
        this.timer = setInterval(this.getData.bind(this), 10000);
    }

    //Function for getting data from API
   getData() {
       fetch(URL).then(res => res.json()).then(json => {
           this.setState({weatherData: json})
           }).catch(error => {
           console.log('error', error)
       });
   }

    //Clear interval when components is unmounted/deleted
    componentWillUnmount() {
        clearInterval(this.timer);
    };

    render() {

        const weatherData = this.state.weatherData;
        /*if (weatherData == null) return (                                                              //
            <div>
                <div>Loading...</div>
                <ProgressBar active now={45} /></div>
        );*/
        const weather = weatherData!= null ? weatherData.CurrentWeather : null;

        console.log("render");
        console.log(weather);
       /* if(weatherData != null) {
            const iconPath = "img/set/"+weather.wx_icon.replace("gif","png");
        }

        const date = new Date().toLocaleDateString();*/
        return (
            <div>
                {Boolean(weather!=null) ?
                    <div>
                        <h4> Уже прошло {this.state.seconds} секунд </h4>
                        <ul className="fields">
                            <li> {weather.cloudtotal_pct}%</li>
                            <li> {weather.dewpoint_c}°</li>
                            <li> {weather.feelslike_c}°</li>
                            <li> {weather.humid_pct}%</li>
                            <li> {weather.slp_in} inches</li>
                            <li> {weather.vis_km} kilometers</li>
                            <li> {weather.winddir_deg} degrees</li>
                            <li> {weather.windspd_kmh} km/h</li>
                        </ul>
                    </div>
                    :
                    <div>
                        <h4> Уже прошло {this.state.seconds} секунд </h4>
                        <WeatherLoading />
                    </div>
                }
            </div>
        );
    }
}

class App extends React.Component {
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

export default App;
