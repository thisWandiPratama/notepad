import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';


class OTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      confirm:null,
      code:''
    };
  }

   signInWithPhoneNumber = async(phoneNumber) => {
    const confirmation = await auth().signInWithPhoneNumber(`+62${phoneNumber}`);
    if(confirmation){
      this.setState({comfirm:confirmation})
      this.props.navigate("OTP",{'confirm':this.state.comfirm})
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: "#aeaeae" }}>
        <View style={{ height: "50%", width: "80%", alignItems: "center", justifyContent: "space-around" }}>
          <Text style={{ fontSize: 30, color: "#000", fontWeight: "bold" }}> What's ToDo </Text>
          <Image
            source={{
              uri: "https://i.ibb.co/kqk7YW7/check-1.png"
            }}
            style={{
              height: 100,
              width: 100,
              marginTop: 100
            }}
          />
          <View style={{width:"100%", alignItems:"center", paddingTop:50}}>
            <TextInput
              placeholder='Enter phone number'
              keyboardType='numeric'
              style={{
                color: "white",
                backgroundColor: "white",
                width:"80%",
                borderRadius: 20
              }}
            />
            <TouchableOpacity 
            onPress={() => this.props.navigation.navigate("Home")}
            style={{
              height:50,
              width:"60%",
              backgroundColor:"red", 
              marginTop: 20,
              alignItems:'center',
              justifyContent:"center",
              borderRadius:20,
            }}>
              <Text style={{
               fontSize: 30,
               color:"white",
               fontWeight:"bold" 
              }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default OTP;
