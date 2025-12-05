import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

class Timer extends Component {
  static propTypes = {
    start: PropTypes.bool,
    reset: PropTypes.bool,
    msecs: PropTypes.bool,
    options: PropTypes.object,
    handleFinish: PropTypes.func,
    totalDuration: PropTypes.number,
    getTime: PropTypes.func,
    getMsecs: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      started: false,
      remainingTime: props.totalDuration,
    };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.formatTime = this.formatTime.bind(this);
    const width = props.msecs ? 220 : 150;
    this.defaultStyles = {
      container: {
        backgroundColor: '#000',
        padding: 5,
        borderRadius: 5,
        width: width,
      },
      text: {
        fontSize: 30,
        color: '#FFF',
        marginLeft: 7,
      }
    };
  }

  componentDidMount() {
    if(this.props.start) {
      this.start();
    }
  }

 formatTimeString(time, showMsecs) {
    let msecs = time % 1000;
  
    if (msecs < 10) {
      msecs = `00${msecs}`;
    } else if (msecs < 100) {
      msecs = `0${msecs}`;
    }
  
    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(time / 60000);
    let hours = Math.floor(time / 3600000);
    seconds = seconds - minutes * 60;
    minutes = minutes - hours * 60;
    let formatted;
    if (showMsecs) {
      formatted = `${hours < 10 ? 0 : ""}${hours}:${
        minutes < 10 ? 0 : ""
      }${minutes}:${seconds < 10 ? 0 : ""}${seconds}:${msecs}`;
    } else {
      formatted = `${hours < 10 ? 0 : ""}${hours}:${
        minutes < 10 ? 0 : ""
      }${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
    }
  
    return formatted;
  }

  componentWillReceiveProps(newProps) {
    if(newProps.start) {
      this.start();
    } else {
      this.stop();
    }
    if(newProps.reset) {
      this.reset(newProps.totalDuration);
    }
  }

  start() {
    const handleFinish = this.props.handleFinish ? this.props.handleFinish : () => alert("Timer Finished");
    const endTime = new Date().getTime() + this.state.remainingTime;
    this.interval = setInterval(() => {
      console.log('Running interval')
      const remaining = endTime - new Date();
      if(remaining <= 1000) {
        this.setState({remainingTime: 0});
        this.stop();
        handleFinish();
        return;
      }
      this.setState({remainingTime: remaining});
    }, 100);
  }

  stop() {
    console.log("CLEARING INTERVAL")
    clearInterval(this.interval);
  }

  reset(newDuration) {
    this.setState({
      remainingTime: 
        this.props.totalDuration !== newDuration ? 
          newDuration : 
          this.props.totalDuration
      });
  }

  formatTime() {
    const { getTime, getMsecs, msecs } = this.props;
    const now = this.state.remainingTime;
    const formatted = this.formatTimeString(now, msecs);
    if (typeof getTime === "function") {
      getTime(formatted);
    }
    if (typeof getMsecs === "function") {
      getMsecs(now)
    }
    return formatted;
  }

  render() {

    const styles = this.props.options ? this.props.options : this.defaultStyles;

    return(
      <View style={styles.container}>
        <Text style={styles.text}>{this.formatTime()}</Text>
      </View>
    );
  }
}

export default Timer;
