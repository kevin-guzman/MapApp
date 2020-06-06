import React, {Component} from 'react'
import {    StyleSheet, 
            Text, 
            View,
            StatusBar,
            TouchableOpacity,
            TextInput,
            AsyncStorage,
            Alert
        } from 'react-native';
import {QRCode} from 'react-native-custom-qr-codes-expo';
import Styles from '../styles/style'


class QR extends Component{

    constructor() {
        super();
        this.state = {
            valueForQRCode: 'n',
            HospitalsInfo:null,
            Aux:[],
        };
    }


    async submit(obj) {
        const {navigation}= this.props;

        try{
            fetch('http://181.54.182.7:5000/api/temporal', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type':'application/json',
            },
            body: JSON.stringify({
            
                obj,
                nameh: JSON.stringify(navigation.getParam('HospitalName', '')),
                lat: JSON.stringify(navigation.getParam('UserLatitude', '')),
                lng: JSON.stringify(navigation.getParam('UserLongitude', '')),
            
            }) 
        })
        .then((response) => response.json())
            .then((text) => {
            //console.log(text._id)
            //console.log(text._id.toString())
            this.setState({valueForQRCode: (text._id).toString()})
            })
            .catch(err=>{
            console.log(err)
            })
        }catch(err){

        }
        
    }


    displayData = async ()=>{  
        try{  

            let user = await AsyncStorage.getItem('UserData'); 
            const {navigation}= this.props;
            const aux ={
                nameh: JSON.stringify(navigation.getParam('HospitalName', '')),
                lat: JSON.stringify(navigation.getParam('UserLatitude', '')),
                lng: JSON.stringify(navigation.getParam('UserLongitude', ''))
            }
            //var obj =[]
            obj = JSON.parse(user)
            /* this.setState({Aux: user})
            
            Aux.map() */
            obj['nameh']=JSON.stringify(navigation.getParam('HospitalName', ''))
            obj['lat']=JSON.stringify(navigation.getParam('UserLatitude', ''))
            obj['lng']=JSON.stringify(navigation.getParam('UserLongitude', ''))
            console.log(JSON.stringify(navigation.getParam('HospitalName', '')))
            console.log('Heree')
            console.log(obj) 
            //Alert.alert(JSON.stringify(obj))
            this.submit(obj)

        }  
        catch(error){  
            alert(error)  
        }  
    }


    componentDidMount(){
        {this.displayData()}
    }


    render(){
        const {navigation}= this.props;
        return(

            <View style={styles.container} >
                <View style={styles.header} >
                    <Text style={Styles.TextTitle}>
                        Hospital: {JSON.stringify(navigation.getParam('HospitalName', ''))}
                    </Text>
                    <Text style={Styles.TextTitle}>
                        Direccion: {JSON.stringify(navigation.getParam('HospitalAddres', ''))}
                    </Text>
                </View>
                
                <View style={styles.QR} >
                    <QRCode     
                        content={this.state.valueForQRCode} 
                        logosize={250}
                        color="#000"
                    />                    
                </View>
                <View style={styles.buttonRight} >
                    <TouchableOpacity style={Styles.buttonPrimary} onPress={()=>navigation.navigate('Hospitals')}> 
                        <Text style={Styles.TextButton}> Mapa </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
    QR:{
        flex:4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header:{
        flex:1,
        justifyContent: 'flex-end',
        alignItems:'center'
    },
    buttonRight:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems: 'center'
    }
});
export default QR