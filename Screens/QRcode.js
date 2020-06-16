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
import { Icon } from 'react-native-elements'


class QR extends Component{

    constructor() {
        super();
        this.state = {
            valueForQRCode: 'n',
            HospitalsInfo:null,
            Aux:[],
            Ir: false
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
                /* nameh: JSON.stringify(navigation.getParam('HospitalName', '')),
                lat: JSON.stringify(navigation.getParam('UserLatitude', '')),
                lng: JSON.stringify(navigation.getParam('UserLongitude', '')), */
            
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
            this.setState({Ir: true})
        }catch(err){

        }


        
    }


    displayData = async ()=>{
        this.setState({valueForQRCode: 'This is a QR code in AtiendeMeApp', Ir: true})  
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
            //alert(error)  
        }  
    }


    /* componentDidMount(){
        {this.displayData()}
    } */


    render(){
        const {navigation}= this.props;
        const {Ir}=this.state;
        return(

            <View style={styles.container} >
                <View style={styles.header} >
                    <Text style={Styles.TextTitle}>
                        Hospital: {navigation.getParam('HospitalName', '')}
                    </Text>
                    <Text style={Styles.TextTitle}>
                        Direccion: {navigation.getParam('HospitalAddres', '')}
                    </Text>
                </View>
                
                <View style={styles.viewQR} >
                    <View style={styles.QR} >
                        {
                            Ir === true?
                            <QRCode     
                                content={this.state.valueForQRCode} 
                                logosize={250}
                                color="#000"
                            />
                            :
                            <View style={{width:250,height:250, borderWidth:0.4, borderColor: 'rgba(0,0,0,0.1)'}} >

                            </View>
                            //null
                        }
                    </View>
                </View>

                <View style={styles.buttons} >
                    <TouchableOpacity style={Styles.buttonPrimary} onPress={()=>navigation.navigate('Hospitals')}>
                        <Text style={Styles.TextButton}> Mapa </Text>
                        <Icon name="place" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.buttonPrimary} onPress={()=> this.displayData()}  /* this.setState({Ir: true}) */ > 
                        <Text style={Styles.TextButton}> Ir </Text>
                        <Icon name="send" size={20} />
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
    viewQR:{
        flex:4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    QR:{
        borderBottomColor: 'gray',
        borderBottomWidth: 0.9,
        borderTopColor: 'gray',
        borderTopWidth: 0.9,
    },
    header:{
        flex:1,
        justifyContent: 'flex-end',
        alignItems:'center'
    },
    buttons:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems: 'center'
    },
});
export default QR