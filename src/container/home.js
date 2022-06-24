import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, TextInput, TouchableOpacity, ScrollView, Modal, } from 'react-native';
import DatePicker from 'react-native-date-picker'
import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: true,
      todos: [],
      id: 0,
      modalVisible: false,
      // data
      title: "",
      deadline: new Date(),
      alarm: new Date(),
      lokasi: "",
      prioritas: "",
      checklist: false,
      opendeadline: false,
      openalarm: false,
      datalist: ["Sangat Penting", "Penting", "Biasa"]
    };
  }

async  componentDidMount() {
  try {
    const jsonValue = await AsyncStorage.getItem('@todos')
    this.setState({
      todos:JSON.parse(jsonValue)
    })
  } catch(e) {
  }
    setTimeout(() => {
      this.setState({
        isloading: false
      })
    }, 3000);
  }

  listTodos = () => {
    return this.state.todos.map((value, index) => {
      return (
        <TouchableOpacity
        onLongPress={() => this.delete(value.id)}
        key={index} style={{
          height: 100,
          width: "100%",
          padding: 10,
          justifyContent: "center",
          borderRadius: 20,
          marginBottom: 10
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#000"
          }}>{value.deadline}</Text>
          <View style={{ flexDirection: "row", width: "100%", height: 80, backgroundColor: "#aeaeae", alignItems: 'center' }}>
            <View
              style={{ height: "90%", width: 10, backgroundColor: value.prioritas == 0 ? "red" : value.prioritas == 1 ? "orange" : "green" }}
            />
            <View style={{ height: "80%", width: "70%", marginLeft: 2 }}>
              <Text style={{
                color: "#000",
                fontSize: 14,
                paddingLeft: 5
              }}>{value.title} </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.update(value.checklist, value.id)}

              style={{
                height: "90%",
                width: 50,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 20
              }}>
              {value.checklist ?
                <Image
                  source={{
                    uri: "https://i.ibb.co/SQ9f5kc/check-mark-black-outline.png"
                  }}
                  style={{
                    height: 40,
                    width: 40
                  }}
                />
                :
                <Image
                  source={{
                    uri: "https://i.ibb.co/X3Zhgkj/check-mark-black-outline-1.png"
                  }}
                  style={{
                    height: 40,
                    width: 40
                  }}
                />
              }
            </TouchableOpacity>
            <View style={{ height: "90%", alignItems: "center", justifyContent: "center", width: 70 }}>
              <Text style={{
                fontWeight: "bold",
                fontSize: 15,
                paddingLeft: 10,
                fontWeight: "bold"
              }}>{value.alarm}</Text>
              <Text>PM</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    })
  }


  save = async() => {
    if (this.state.title.length == 0 || this.state.lokasi.length == 0 || this.state.prioritas.length == 0) {
      alert("Semua data bersifat wajib diisi")
    } else {
      var datainputan = {
        "id": this.state.todos.length + 1,
        "title": this.state.title,
        "deadline": `${this.state.deadline.getDate()}/${this.state.deadline.getMonth()}/${this.state.deadline.getFullYear()}`,
        "alarm": `${this.state.alarm.getHours() < 10 ? "0" + this.state.alarm.getHours() : this.state.alarm.getHours()}:${this.state.alarm.getMinutes() < 10 ? "0" + this.state.alarm.getMinutes() : this.state.alarm.getMinutes()}`,
        "lokasi": this.state.lokasi,
        "prioritas": this.state.prioritas,
        "checklist": false
      }
      this.setState({ todos: [...this.state.todos, datainputan], title: "", lokasi: "", prioritas: "" })
      
      const save = [...this.state.todos, datainputan]
      const jsonValue = JSON.stringify(save)
      await AsyncStorage.setItem('@todos', jsonValue)
      this.setState({
        modalVisible: !this.state.modalVisible
      })
    }
  }

  update = async(checklist, id) => {
    const data = this.state.todos.map(obj => {
      if (obj.id === id) {
        return { ...obj, checklist: !checklist };
      }
      return obj;
    });

    this.setState({
      todos: data
    })
    const jsonValue = JSON.stringify(data)
      await AsyncStorage.setItem('@todos', jsonValue)
  }

  delete = async(id) => {
    this.setState({
      todos: this.state.todos.filter(obj => obj.id !== id)
    })

    const jsonValue = JSON.stringify(this.state.todos.filter(obj => obj.id !== id))
      await AsyncStorage.setItem('@todos', jsonValue)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 30, color: "#000", fontWeight: "bold", textAlign: "center", marginTop: 20 }}> What's ToDo </Text>
        <View style={{ flex: 1, margin: 10 }}>
          <ScrollView>
            {this.state.isloading ? <View style={{
              flex:1,
              justifyContent:"center",
              alignItems:"center"
            }}>
              <ActivityIndicator/>
            </View> : this.state.todos.length == 0 ? <Text style={{textAlign:"center"}}>Tidak Ada Data</Text>: this.listTodos() }
          </ScrollView>
        </View>
        <View style={{ height: 100, width: "100%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center", position: "absolute", bottom: 3 }}>
          <TouchableOpacity
            onPress={() => this.setState({
              modalVisible: !this.state.modalVisible
            })}
            style={{
              height: 80,
              width: 100,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 10,
              borderRadius: 15
            }}>
            <Image
              source={{
                uri: "https://i.ibb.co/xzVPwxn/add.png"
              }}
              style={{
                height: 80,
                width: 80
              }}
            />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              modalVisible: this.state.modalVisible
            })
          }}
        >
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <Text style={{ fontSize: 30, color: "#000", fontWeight: "bold", marginTop: 20 }}> What's ToDo </Text>
            <View style={{ marginLeft: 20, marginRight: 20, width: "90%", height: 300, backgroundColor: "#aeaeae", borderRadius: 10 }}>
              <TextInput
                placeholder='Masukan Tugas Baru di Sini'
                multiline={true}
                style={{
                  height: 300,
                  width: "90%",
                  textAlignVertical: "top",
                  fontSize: 15
                }}
                onChangeText={title => this.setState({ title: title })}
              />
            </View>
            <View style={{
              width: "90%",
              marginTop: 20,
              marginRight: 20,
              marginLeft: 20,
              flexDirection: "row",
              height: 50,
              borderBottomColor: "#aeaeae",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <View style={{
                  height: 30,
                  width: 30,
                  backgroundColor: "#aeaeae",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5,
                  borderRadius: 10
                }}>
                  <Text style={{
                    fontSize: 20,
                    color: "white",
                    fontWeight: "bold"
                  }}>31</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Batas Waktu</Text>
              </View>
              <DatePicker
                modal
                mode={"date"}
                open={this.state.opendeadline}
                date={this.state.deadline}
                onConfirm={(date) => {
                  this.setState({ opendeadline: !this.state.opendeadline, deadline: date })
                  console.log(date)
                }}
                onCancel={() => {
                  this.setState({ opendeadline: !this.state.opendeadline })
                }}
              />

              <TouchableOpacity onPress={() => this.setState({ opendeadline: !this.state.opendeadline })} style={{ height: 30, width: 100, backgroundColor: "#aeaeae", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                <Text>{this.state.deadline.getDate()}/{this.state.deadline.getMonth()}/{this.state.deadline.getFullYear()}</Text>
              </TouchableOpacity>
            </View>
            <View style={{
              width: "90%",
              flexDirection: "row",
              height: 50,
              borderBottomColor: "#aeaeae",
              borderBottomWidth: 1,
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: 20,
              marginLeft: 20,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <View style={{
                  height: 30,
                  width: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5,
                  borderRadius: 10
                }}>
                  <Image
                    source={{
                      uri: "https://i.ibb.co/McVZZz7/bell.png"
                    }}
                    style={{
                      height: 30,
                      width: 30
                    }}
                  />

                </View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Waktu dan Pengingat</Text>
              </View>
              <DatePicker
                modal
                mode={"time"}
                open={this.state.openalarm}
                date={this.state.alarm}
                onConfirm={(date) => {
                  this.setState({ openalarm: !this.state.openalarm, alarm: `${this.state.alarm.getHours() < 10 ? "0" + this.state.alarm.getHours() : this.state.alarm.getHours()}:${this.state.alarm.getMinutes() < 10 ? "0" + this.state.alarm.getMinutes() : this.state.alarm.getMinutes()}` })
                  console.log(date)
                }}
                onCancel={() => {
                  this.setState({ openalarm: !this.state.openalarm })
                }}
              />
              <TouchableOpacity onPress={() => this.setState({ openalarm: !this.state.openalarm })} style={{ height: 30, width: 100, backgroundColor: "#aeaeae", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                <Text>{this.state.alarm.getHours() < 10 ? <Text>0{this.state.alarm.getHours()}</Text> : this.state.alarm.getHours()}:{this.state.alarm.getMinutes() < 10 ? <Text>0{this.state.alarm.getMinutes()}</Text> : this.state.alarm.getMinutes()}</Text>
              </TouchableOpacity>
            </View>
            <View style={{
              width: "90%",
              flexDirection: "row",
              height: 50,
              borderBottomColor: "#aeaeae",
              borderBottomWidth: 1,
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: 20,
              marginLeft: 20,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <View style={{
                  height: 30,
                  width: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5,
                  borderRadius: 10
                }}>
                  <Image
                    source={{
                      uri: "https://i.ibb.co/tJ48tQ2/map.png"
                    }}
                    style={{
                      height: 30,
                      width: 30
                    }}
                  />
                </View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Lokasi</Text>
              </View>
              <View style={{ height: 50, width: "50%", backgroundColor: "#aeaeae", borderRadius: 10 }}>
                <TextInput
                  placeholder='Masukan lokasi'
                  onChangeText={(lokasi) => this.setState({ lokasi: lokasi })}
                  style={{
                    textAlign: "left"
                  }}
                />
              </View>
            </View>
            <View style={{
              width: "90%",
              flexDirection: "row",
              height: 60,
              borderBottomColor: "#aeaeae",
              borderBottomWidth: 1,
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: 20,
              marginLeft: 20,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <View style={{
                  height: 30,
                  width: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5,
                  borderRadius: 10
                }}>
                  <Image
                    source={{
                      uri: "https://i.ibb.co/s9HCjGx/exclamation-mark.png"
                    }}
                    style={{
                      height: 30,
                      width: 30
                    }}
                  />
                </View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Prioritas</Text>
              </View>
              <View style={{ height: 60, width: "50%", borderRadius: 10, marginRight: 24, justifyContent: "center" }}>
                <SelectDropdown
                  data={this.state.datalist}
                  onSelect={(selectedItem, index) => {
                    this.setState({
                      prioritas: index
                    })
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    return item
                  }}
                  style={{
                    marginRight: 20
                  }}
                />
              </View>
            </View>
            <View style={{ width: "100%", height: 100, justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity onPress={() => this.save()} style={{ height: 50, width: "60%", justifyContent: "center", alignItems: "center", backgroundColor: "#aeaeae", borderRadius: 20 }}>
                <Text style={{ fontSize: 25, color: "white", fontWeight: "bold" }}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

}

export default Home;