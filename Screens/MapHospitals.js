import React, {Component} from 'react'
import { StyleSheet, 
          Text, 
          View,
          StatusBar,
          TouchableOpacity,
          Image,
          Alert
        } from 'react-native';
import  MapView,
        {Marker,
        Polyline,
        Callout,
        PROVIDER_GOOGLE,
        GOOGLE_MAPS_APIKEY,
        
      } from 'react-native-maps'; 

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Reload from '../Img/Reload.png'
import CovidMarker from '../Img/MapMarkers/CovidMarker.png'
import GeneralMarker from '../Img/MapMarkers/GeneralMarker.png'
import OdontologiaMarker from '../Img/MapMarkers/OdontologiaMarker.png'





class App extends Component {

  constructor (props){

    
    super(props);

    setInterval(() => {
      this._getLocationAsync();
    }, 200);

   /*  setInterval(() =>{
      this.componentDidMount();    
    },1000);

    setInterval(() =>{
      this.MapList();    
    },1000); */



    this.state={
      Nombre:null,
      Hospitals:[],
      Hospitals:[ 
                  {latitude: 4.699050, longitude: -74.050105, category:1, title:'Tunal'},
                  {latitude: 4.671959, longitude: -74.083579, category:2, title:'Chricales'},
                  {latitude: 4.683959, longitude: -74.083579, category:3, title:'Country'},
                  {latitude: 4.671959, longitude: -74.050105, title:'Kennedy'},
      ], 
      Mapa:[],
      location:null,
      errorMsg:null,
      UserLatitude:0.0,
      UserLongitude:0.0,
      HospitalCategory:'NoSelected',
      Aux:0,
      KeyRefresh:1,
    };
  }



  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: '¡Ha ocurrido un error!.',
      });
    } else {
      this._getLocationAsync();
      this.setState({Aux: 1})
      
    }
  }


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let {Aux} = this.state;
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    if ( Aux !== 0){
      let location = await Location.getCurrentPositionAsync({});
      let UserLongitude = this.state;
      this.setState({ location });
      this.setState({UserLatitude: location.coords.latitude, UserLongitude: location.coords.longitude})
    }


  };


  async componentDidMount(){
    
    //console.log('We are in')
    const url = 'http://181.54.182.7:5000/api/hospitals'
    const response = await fetch(url)
    let data = await response.json()
    //console.log(data)

      this.setState({
        Mapa:data
      })

      let DataRead = this.state.Mapa 
      let Go  = []
      DataRead.map(function(arr){
        
        const obj={
          latitude:arr.lat,
          longitude:arr.lng,
          title:arr.name,
          address:arr.address,
          category:arr.category
        }
        Go.push(obj)
        console.log(obj)
      })
      this.setState(
        {
          Hospitals:Go
        }
      )

      /* {this.MapList()} */
      
    
  }

  GoToQR = (HN,HA) =>{
    const {navigation}= this.props;
    
    navigation.navigate('QR', 
                              {
                                HospitalName: HN, 
                                HospitalAddres:HA, 
                                UserLatitude: this.state.UserLatitude, 
                                UserLongitude: this.state.UserLongitude 
                              }
                          )
  
  }



  render(){

    const Bogotá_Coordinates ={ latitude: 4.6097100,
                                longitude: -74.0817500,
                                latitudeDelta: 0.27, /*0.0922*/
                                longitudeDelta: 0.27, /*0.0421*/};
    const {navigation}= this.props;
    const {HospitalCategory} = this.state;
    const {KeyRefresh} = this.state;
      return (

        <View style={styles.container}>

          <View style={styles.mapContainer} key={KeyRefresh} >
            <MapView 
                style={styles.mapStyle} 
                showsUserLocation={true}
                ref='map'
                initialRegion={Bogotá_Coordinates}
                
              >
                
                {
                    this.state.Hospitals.map( (x,i) =>{    
                      return(
                        <Marker 
                          coordinate={
                            {latitude: parseFloat(x.latitude) , 
                            longitude: parseFloat(x.longitude)} 
                          } 
                          key={i}
                          title={x.title }
                          description={x.address}
                          onCalloutPress={()=> this.GoToQR(x.title,x.address)}
                          

                        >
                        
                        {
                          (x.category === 1 && HospitalCategory === 'Covid' ) || (HospitalCategory === 'NoSelected' && x.category === 1) ?
                            
                              <Image
                                  onLoad={() => this.forceUpdate()}
                                  onLayout={() => this.forceUpdate()}
                                  source={require('../Img/MapMarkers/CovidMarker.png')}
                                  style={styles.markerImage}
                                >
                              </Image>
                            :
                              (x.category === 2 && HospitalCategory === 'General' ) || (HospitalCategory === 'NoSelected' && x.category === 2) ?
                                <Image
                                  onLoad={() => this.forceUpdate()}
                                  onLayout={() => this.forceUpdate()}
                                  source={require('../Img/MapMarkers/GeneralMarker.png')}
                                  style={styles.markerImage}
                                >
                                </Image>                              
                                :
                                  (x.category === 3 && HospitalCategory === 'Odontologia' ) || (HospitalCategory === 'NoSelected' && x.category === 3) ?
                                    <Image
                                      onLoad={() => this.forceUpdate()}
                                      onLayout={() => this.forceUpdate()}
                                      source={require('../Img/MapMarkers/OdontologiaMarker.png')}
                                      style={styles.markerImage}
                                    >
                                    </Image>
                                    :
                                      <Image
                                        onLoad={() => this.forceUpdate()}
                                        onLayout={() => this.forceUpdate()}
                                        source={require('../Img/MapMarkers/Undefined.png')}
                                        style={styles.markerImage}
                                      >
                                      </Image>                                
                        }
                      {/* <Image
                        onLoad={() => this.forceUpdate()}
                        onLayout={() => this.forceUpdate()}
                        source={require('../Img/MapMarkers/CovidMarker.png')}
                        style={{width:50, height:50}}
                      >
                      </Image> */}
                          

                        </Marker>
                      )
                    } )
                }
                
              </MapView>
              
          </View>  

             

            <View style={styles.footer} >
              <View style={styles.viewTouchable} >
                <TouchableOpacity
                  onPress={(KeyRefresh)=> this.setState({HospitalCategory: 'Odontologia', KeyRefresh: KeyRefresh+1})
                }
                  style={{
                          borderRadius:50,
                          borderColor:'rgba(26,100,122,0.8)',
                          backgroundColor:'rgba(71,185,219,0.5)',
                          borderWidth:1,
                          margin:'3%',
                        }}
                >
                  <Text style={styles.textTouchable} >
                      Odontología
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.viewTouchable} >
                <TouchableOpacity
                  onPress={(KeyRefresh)=> this.setState({HospitalCategory: 'Covid', KeyRefresh: KeyRefresh+1})}
                  style={{
                          borderRadius:50,
                          borderColor:'rgba(44,129,49,0.8)',
                          backgroundColor:'rgba(91,225,100,0.5)',
                          borderWidth:1,
                          margin:'3%',
                        }}
                >
                  <Text style={styles.textTouchable} >
                    Covid
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.viewTouchable} >
                <TouchableOpacity
                  onPress={(KeyRefresh)=> this.setState({HospitalCategory: 'General', KeyRefresh: KeyRefresh+1})}
                  style={{
                          borderRadius:50,
                          borderColor:'rgba(131,39,39,10.8)',
                          backgroundColor:'rgba(214,67,67,0.5)',
                          borderWidth:1,
                          margin:'3%',
                        }}
                >
                  <Text style={styles.textTouchable} >
                    General
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{flex:1,  /* marginTop:'8%', */ alignItems:'flex-end', marginHorizontal:'1%'}} >
                <TouchableOpacity
                  onPress={(KeyRefresh)=> this.setState({HospitalCategory: 'NoSelected', KeyRefresh: KeyRefresh+1})} //this.componentDidMount()
                  
                >
                  <Image 
                    source={Reload}
                    style={styles.image}
                  >
                  </Image>                
                </TouchableOpacity>
              </View> 
            </View>
          
        </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight
    //paddingTop:'15%',

    //flexDirection:'row'
    
  },

  viewTouchable:{
    marginHorizontal:'1%',
    alignSelf:'center',
  },

  textTouchable:{
    textAlign:'center', 
    margin:'3%'
  },

  markerImage:{
    width:70,
    height:70
  },

  mapStyle:{
    flex:1,
  },

  mapContainer:{
    flex:10,
    borderColor:'black',
    borderWidth:1,
    marginHorizontal:'3%',
    //marginVertical:'7%',
    width:'95%',
    height:'90%',
    borderRadius:4,
  },

  image:{
    width:45,
    height:45,
    borderRadius:30,
    //flex:1
  },

  footer:{
    flexDirection:'row',
    //justifyContent:'space-between',
    //marginVertical:'4%'
  },

});
export default App