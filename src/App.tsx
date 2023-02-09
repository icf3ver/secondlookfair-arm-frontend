
import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import ExpoDraw from 'expo-draw';
import io from 'socket.io-client';

import Logo from '../assets/logo.svg';
import Appstyles from './App.module.scss';
import LETTERS from './Letters';

import {Dimensions} from 'react-native';

// So text does not run too far off the page
const MAX_CHAR_COUNT = 10;

// Max packet length TODO
const MAX_PACKET_LEN = 50000;

const REMOTE_PORT = 5000;

const REMOTE_HOST = '127.0.0.1';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


// const REMOTE_HOST = '127.0.0.1'; // Should set up cheap clean tmp DNS
const REMOTE_URL = "http://" + REMOTE_HOST + ':' + REMOTE_PORT;

export default function App() {
  const socket = io(REMOTE_URL, {
    transports: ['websocket'],
    reconnectionAttempts: 15
  });

  const canvasRef = useRef(null);
  var _undo;
  var _clear;

  const [inputTy, setInputTy] = useState(0);

  const [text, setText] = useState("");
  const [_strokes, setStrokes] = useState([]);
  
  const __transmitStrokes = async(strokes) => {
    var msg = "";

    // Transform stroke to percentage (Note inverse must be done for letters)
    var elemWidth = windowWidth * 0.8; // 80% of width
    var elemHeight = windowHeight * 0.83 * 0.5;

    strokes.forEach(stroke => { // Ignore timestamps (Speed does not matter just get there!)
      msg += "start,";
      stroke.forEach(pos => {
        msg += "(" + 
          ((pos.x > elemWidth) ? elemWidth : ((pos.x < 0) ? 0 : pos.x))/elemWidth + "," + 
          ((pos.y > elemHeight) ? elemHeight : ((pos.y < 0) ? 0 : pos.y))/elemHeight + "),";
      });
    });

    console.log(msg);

    if (msg.length > MAX_PACKET_LEN) {
      alert("Instruction set too large!");
    } else {
      socket.emit(msg);
    }
  };

  const __handleSubmitText = async(_event) => {
    var strokes = [];
    var valid = true;

    text.split("").forEach((letter) => {
      var idx = 'A'.charCodeAt(0) - letter.charCodeAt(0);
      if (idx > 25) {
        valid = false;
      } else {
        strokes = strokes.concat(transformLetters(LETTERS[idx]));
      }
    });
    
    if (!valid) {
      alert("Only input uppercase letters!");
    } else {
      // __transmitStrokes(strokes);
      alert("Unimplemented");
    }

    setText("");
    setInputTy(0);
  };

  const __handleSubmitCanvas = async(_event) => {
    __transmitStrokes(_strokes);

    //_clear(); // No need it gets rerendered with no strokes
    setInputTy(0);
  };

  return (
    <View style={Appstyles.container}>
      <TouchableOpacity style={Appstyles.header_container} onPress={(event) => setInputTy(0)}>
        <Logo style={Appstyles.image} width={100} height={100}/>
        <Text style={Appstyles.title}> Terraformers </Text>
        <Text style={Appstyles.subscript}> University Rover Challenge </Text>
      </TouchableOpacity>

      <View style={Appstyles.content_container}>
        { inputTy == 0 &&
          <View style={Appstyles.home_container}>
          {/* <TouchableOpacity style={Appstyles.home_btn} onPress={(event) => setInputTy(1)}><Text style={Appstyles.btn_txt}>Text</Text></TouchableOpacity> */}
          <TouchableOpacity style={Appstyles.home_btn} onPress={(event) => setInputTy(2)}><Text style={Appstyles.btn_txt}>Draw</Text></TouchableOpacity>   
          </View>
        }
        { inputTy == 1 &&
          <View style={Appstyles.input_container1}>
            <View style={Appstyles.input_line_container}>
              <View style={Appstyles.text_input_container}>
                <TextInput style={Appstyles.text_input} onChangeText={setText} value={text} maxLength={MAX_CHAR_COUNT}/>
              </View>
              <TouchableOpacity style={Appstyles.submit_btn_txt} onPress={__handleSubmitText}><Text style={Appstyles.btn_txt}>⏎</Text></TouchableOpacity>
            </View>
          </View>
        }
        { inputTy == 2 &&
          <View style={Appstyles.input_container2}>
            <ExpoDraw
              ref = {canvasRef}
              strokes={LETTERS[1]}
              containerStyle={Appstyles.canvas}
              rewind={(undo) => {_undo = undo}}
              clear={(clear) => {_clear = clear}}
              color={'#FFFFFF'}
              strokeWidth={4}
              enabled={true}
              onChangeStrokes={setStrokes}
            />
            <TouchableOpacity style={Appstyles.submit_btn_canvas} onPress={__handleSubmitCanvas}><Text style={Appstyles.btn_txt}>⏎</Text></TouchableOpacity>
          </View>
        }
      </View>

      <StatusBar style="auto"/>
    </View>
  );
}


const SCALING = 10;

const SPACING = 10; // units

function transformLetters(strokes: any): any {
  return [];
}