import React, { Component } from 'react'

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Timer from './Timer'

//  Config
import Layout from '../../config/layout'
import Colors from '../../config/colors'

//  Components
import BaseButton from '../common/BaseButton'


const options = {
    container: {
      backgroundColor: Colors.primary,
      padding: 5,
      borderRadius: 10,
      width: 300,
      marginBottom: 10,
    },
    text: {
      fontSize: 30,
      color: '#FFF',
      marginLeft: 7,
    }
  };

export default class TimeControls extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      timerReset: false,
    };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

    toggleTimer() {
      this.setState({timerStart: !this.state.timerStart, timerReset: false});
    }
 
    resetTimer() {
      this.setState({timerStart: false, timerReset: true});
    }


    getFormattedTime = (time) => {
      this.currentTime = time;
    };

      render(){
        const { timeLimit, handleFinish } = this.props
        return(
            <View style={styles.container}>
                <Timer 
                    totalDuration={timeLimit * 1000} 
                    msecs
                    start={this.state.timerStart}
                    reset={this.state.timerReset}
                    options={options}
                    handleFinish={handleFinish}
                    getTime={this.getFormattedTime} />
                    {/* <BaseButton
                      onPress={this.toggleTimer}
                      label={!timerStart ? "Start" : "Stop"}
                      containerStyles={styles.button}
                    /> */}
                     {/* <BaseButton
                      onPress={this.resetTimer}
                      label={"Reset"}
                      containerStyles={styles.button}
                    /> */}
              
            </View>
        )
      }
}

const styles = StyleSheet.create({
    container:{
      display: 'flex',
      flexDirection: 'column',
      width: 300,
      height: 300
    },
    button:{
      marginBottom: 10,
    }
})