import React, {Component} from 'react'
import { StyleSheet, 
          Text, 
          View,
          StatusBar,
          TouchableOpacity,
          Image
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



var cont=0;
var Saved;

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
      /* Hospitals:[ 
                  {latitude: 4.699050, longitude: -74.050105, category:1},
                  {latitude: 4.671959, longitude: -74.083579, category:2},
                  {latitude: 4.683959, longitude: -74.083579, category:3},
      ],  */
      Mapa:[],
      location:null,
      errorMsg:null,
      UserLatitude:0.0,
      UserLongitude:0.0,
      HospitalCategory:'',
      Aux:0,
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

      {this.MapList()}
      
    
  }


  GoToQR = (HN,HA) =>{
    const {navigation}= this.props;
    
    if (cont ===0  ){
      cont++;
      Saved= HN
    }else{
      cont=0
      navigation.navigate('QR', {HospitalName: HN, HospitalAddres:HA, UserLatitude: this.state.UserLatitude, UserLongitude: this.state.UserLongitude })
    }
    
    
  }





  


  render(){

    const Bogotá_Coordinates ={ latitude: 4.6097100,
                                longitude: -74.0817500,
                                latitudeDelta: 0.27, /*0.0922*/
                                longitudeDelta: 0.27, /*0.0421*/};
    const {navigation}= this.props;
      return (

        <View style={styles.container}>

          <View style={styles.mapContainer}>
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
                          onPress={()=> this.GoToQR(x.title,x.address)}
                          //onMagicTap={()=> this.GoToQR(x.title,x.address)}

                          
                          /* onSelect={
                            () => navigation.navigate('QR', 
                                      {
                                      HospitalName: x.title, 
                                      HospitalAddres:x.address, 
                                      UserLatitude: this.state.UserLatitude, 
                                      UserLongitude: this.state.UserLongitude 
                                      }
                                    )
                          } */
                          /* onPress={
                            () => navigation.navigate('QR', 
                                      {
                                      HospitalName: x.title, 
                                      HospitalAddres:x.address, 
                                      UserLatitude: this.state.UserLatitude, 
                                      UserLongitude: this.state.UserLongitude 
                                      }
                                    )
                          } */
                          
                          //pinColor={this.MarkerColor(x.category,0)}
                        >
                        
{/*                         <Callout  
                          onLoad={() => this.forceUpdate()}
                          onLayout={() => this.forceUpdate()}
                          onPress ={  
                                    () => navigation.navigate('QR', 
                                      {
                                      HospitalName: x.title, 
                                      HospitalAddres:x.address, 
                                      UserLatitude: this.state.UserLatitude, 
                                      UserLongitude: this.state.UserLongitude 
                                      }
                                    )
                                    }
                        >
                          <Text>
                            {x.title}
                          </Text>
                          <Text style={{alignSelf:'center'}} >
                            {x.address}
                          </Text>        
                        </Callout> */}


                        {
                          x.category === 1?
                            
                              <Image
                                  onLoad={() => this.forceUpdate()}
                                  onLayout={() => this.forceUpdate()}
                                  source={require('../Img/MapMarkers/CovidMarker.png')}
                                  style={styles.markerImage}
                                >
                              </Image>

                            
                            :
                              x.category === 2?
                                <Image
                                  onLoad={() => this.forceUpdate()}
                                  onLayout={() => this.forceUpdate()}
                                  source={require('../Img/MapMarkers/GeneralMarker.png')}
                                  style={styles.markerImage}
                                >
                                </Image>                              
                                :
                                  x.category === 3?
                                    <Image
                                      onLoad={() => this.forceUpdate()}
                                      onLayout={() => this.forceUpdate()}
                                      source={require('../Img/MapMarkers/OdontologiaMarker.png')}
                                      style={styles.markerImage}
                                    >
                                    </Image>
                                    :
                                    null                                
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

            <View style={{flex:1, marginTop:'8%',alignItems:'flex-end', marginHorizontal:'5%'}} >
              <TouchableOpacity
                onPress={()=> {this.componentDidMount()}}

                onPress={()=> this.componentDidMount()}



                onPress={()=> this.componentDidMount()}
              >
                <Image 
                  source={Reload}
                  style={styles.image}
                >
                </Image>                
              </TouchableOpacity>
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
    width:60,
    height:60,
    borderRadius:30,
    //flex:1
  },

});
export default App