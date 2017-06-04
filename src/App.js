
import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Row, Col, ProgressBar } from "react-bootstrap";


const URL = "http://api.weatherunlocked.com/api/trigger/32.08,34.78/" +
    "current temperature gt 16 includecurrent?" +
    "app_id=30cd5553&app_key=18c2693430a2fc4f7d628166efefa475";

const FIELDS = [
    {desc:"Amount of total cloud",measure:"%"},
    {desc:"Dewpoint",measure:"°"},
    {desc:"Feel like temperature",measure:"°" },
    {desc:"Humidity level",measure:"%"},
    {desc:"Sea level pressure",measure:"millibars"},
    {desc:"Visibility",measure:"km"},
    {desc:"Direction wind is coming from",measure:"degrees"},
    {desc:"Maximum mean wind speed",measure:"km/h"}]

//Component for single line of weather info
class WeatherLine extends React.Component {

    render() {
        return (
            <div>
                <div className="Description">
                    {this.props.desc}: {this.props.val} {this.props.measure}
                </div>
            </div>
        );
    }
}
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
//Component for showing loading process if weather==nul, ex.at the start of App

class DataLoading extends React.Component {

    render(){
        return(
            <div>
                <div>Loading...</div>
                <ProgressBar active now={45} />
            </div>
        )
    }
}

//Component to display data from API
class WeatherDisplay extends React.Component {

    constructor() {
        super();
        this.state = {                              //initialize state of component here
            weatherData: null,
        };
    }

    //Make request to API after component is mounted
    //Create setInterval to get response/refresh info with an interval of 1 minute
    //use .bind(this) to be able to use this.setState,i.e. setInterval() has it's own/different contex

    componentDidMount(){

        fetch(URL).then(res => res.json()).then(json => {
            this.setState({weatherData: json})
        }).catch(error => {
            console.log('error', error)
        });
        this.timer = setInterval(this.getData.bind(this), 60*1000);
    }

    getData() {

        fetch(URL).then(res => res.json()).then(json => {
            this.setState({weatherData: json})
        }).catch(error => {
            console.log('error1', error)
        });
    }

    //Clear interval when components is unmounted/deleted

    componentWillUnmount() {

        clearInterval(this.timer);
    };

    render() {

        const weatherData = this.state.weatherData;
        if (weatherData == null) return (
            <div>
                <DataLoading />
            </div>
        );
        const weather = weatherData!= null ? weatherData.CurrentWeather : null;
        const iconPath = "img/set/"+weather.wx_icon.replace("gif","png");
        const date = new Date().toLocaleDateString();

        //parse json.data into auxiliary array and then combining it whis array of objects FIELDS
        // push into weatherInfoArray

        let arr = [weather.cloudtotal_pct, weather.dewpoint_c, weather.feelslike_c,
            weather.humid_pct,weather.slp_mb,weather.vis_km, weather.winddir_deg, weather.windspd_kmh];
        let weatherInfo=[];
        for(let i=0; i<arr.length; i+=1){
            weatherInfo[i]={desc:FIELDS[i].desc, val:arr[i], measure:FIELDS[i].measure}
        }

        return (
            <div className="container">

                {/*Render if data has been got*/}
                {
                    weather != null &&
                    <div>

                        <Row className="CityAndDate">
                            <Col md={6} xs={12} className="City">
                                <h1> Weather in Tel-Aviv</h1>
                            </Col>
                            <Col md={6} xs={12} className="Date">
                                <h3>today {date}</h3>
                            </Col>
                        </Row>

                        <Row>
                            <div className="WeatherInfo">
                                <Col md={4}>
                                    <div className="ShortInfo">
                                        <div className="Image"><img src={iconPath} alt={weather.wx_desc}/></div>
                                        <div className="WeatherDesc">{weather.wx_desc}</div>
                                        <div className="Temperature">{weather.temp_c}°</div>
                                    </div>
                                </Col>

                                <Col md={8} xs={12} className="GeneralInfo">

                                    {/*Use key==index when rendering collection of elements inside a component
                                     to give the elements a stable identity*/}

                                        <div>
                                            { weatherInfo.map(function (el, index) {
                                                return (
                                                    <WeatherLine
                                                        key={index}
                                                        desc={el.desc}
                                                        val={el.val}
                                                        measure={el.measure}/>
                                                    )
                                                })
                                            }
                                        </div>
                                </Col>
                            </div>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
//Main component App
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