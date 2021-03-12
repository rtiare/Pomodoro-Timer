import React, {useState, useEffect } from 'react';
import { StyleSheet, Vibration, Text, SafeAreaView, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';


const App = props => {

  let interval = null;

  //pre-set number
  const [currentWorkMin, setCurrentWorkMin] = useState('3');
  const [currentWorkSec, sertCurrentWorkSec] = useState('0');
  const [breakMins, setBreakMin] = useState('1');
  const [breakSec, setBreakSec] = useState('0');

  //work-break message and their boolean
  const [displayState, setDisplayState] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('Work');

  //paused and button(pause ? start) state
  const [paused, setPaused] = useState(false);
  const [buttonState, setButtonState] = useState('Pause')

  //final display state 
  const [displayMin, setDisplayMin] = useState(currentWorkMin);
  const [displaySec, setDisplaySec] = useState(currentWorkSec);

  //useEffect hook to update based on if not paused, diplaySec, displayMin
  const timer = useEffect(() => {
    if(paused) {
      setButtonState('Pause');
      interval = setInterval(() => {
        //clear the timer first
        clearInterval(interval);
        //set time if second is 0, but min isnt 0
        if (displaySec == 0) {
          if (displayMin != 0) {
            setDisplaySec(59);
            setDisplayMin(displayMin - 1);
          }
          //if minutes is 0, start break or work: first number - work, second number - break
          else {
            //vibrate when reach 0
            Vibration.vibrate(500);
  
            //decide min and sec based on displayState- false(work), true (break)
            var min = displayState ? currentWorkMin : breakMins;
            var sec = displayState ? currentWorkSec : breakSec;
            //set display message
            var message = displayState ? setDisplayMessage('Work') : setDisplayMessage('Break');

            //set the time new break/work time
            clearInterval(interval)
            setDisplayMin(min);
            setDisplaySec(sec);
            setDisplayState(!displayState);

          }
        }
        //if second not 0, lower by 1
        else {
          setDisplaySec(displaySec - 1);
        }
      }, 1000);
    }
    //if paused, clear time, and set button to start
    else if (!paused) {
      clearInterval(interval);
      setButtonState('Start');
    }
    //clear timer after it updates  every 1000 sec
    return () => clearInterval(interval); 
  }, [paused, displayMin, displaySec]);



  //set timer format 00 
  const minTime = displayMin < 10 ? `0${displayMin}` : displayMin;
  const secTime = displaySec < 10 ? `0${displaySec}` : displaySec;

  const startAndPause = () => {
    //paused ...pauses if you press buttom
    setPaused(!paused);
    setButtonState('Start');
  }

  const reset = () => {
    //if false that means work running- stop process, and reset       
    if (displayState == false) {
      clearInterval(interval)

      setDisplayMessage('Work')
      var min = currentWorkMin
      setDisplayMin(currentWorkMin)
      setDisplaySec(currentWorkSec)

    }
    else {
      clearInterval(interval)

      setDisplayMessage('Break')
      setDisplayMin(breakMins)
      setDisplaySec(breakSec)

    }
    //set button state and pause process
    setButtonState('Start')
    setPaused(false)

  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : null}> 
        <View style={styles.headerContainer} behavior="padding">

          <View style={styles.titleContainer} >
            <Text style={styles.titleText}>Pomodoro Timer</Text>
          </View>

          <View style={styles.bodyContainer}>
            <View style={styles.timerStateContainer}>
              <Text style={styles.timerStateText}>{displayMessage} </Text>
              <Text style={styles.timerText}>{minTime}:{secTime}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button1} onPress={startAndPause}>
                <Text style={{fontSize: 20}}>{buttonState}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={reset}>
                <Text style={{fontSize: 20}}>Reset</Text></TouchableOpacity>
            </View>

            <View style={styles.workContainer}>
              <Text style={{fontWeight: 'bold'}}>Work Mins Time: </Text>
              <TextInput style={styles.workInputMin} value={currentWorkMin} onChangeText={(text) => setCurrentWorkMin(text)}/>
              <Text style={{fontWeight: 'bold'}}>Sec: </Text>
              <TextInput style={styles.workInputSec} value={currentWorkSec} onChangeText={(text) => sertCurrentWorkSec(text)} />
            </View>

            <View behavior="padding" style={styles.breakContainer}>
              <Text style={{fontWeight: 'bold'}}>Break Mins Time: </Text>
              <TextInput style={styles.breakInputMin} value={breakMins} onChangeText = {(text) => setBreakMin(text)} />
              <Text style={{fontWeight: 'bold'}}>Sec: </Text>
              <TextInput style={styles.breakInputSec} value={breakSec} onChangeText = {(text) => setBreakSec(text)} />
            </View>
            
          </View>
        </View>
        <View style={styles.contentContainer}>
        </View>
      </KeyboardAvoidingView>  
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  bodyContainer: {
    flex: 1,
  },
  timerStateContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    paddingTop: 30,
    paddingBottom: 50,
  },
  timerStateText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 45,
    fontWeight: 'bold',
    flexDirection: 'row',
    paddingBottom: 50,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    minHeight: 42,
  },
  button1: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '160%',
    padding: 10,

    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    width: 78,
  },
  button2: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '160%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,

  },
  workContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
    paddingTop: 15,
  },
  workInputMin: {
    borderWidth: 1,
    fontSize: 20,
    borderColor: 'gray',
    marginRight: 20,
    width: 70,
    borderRadius: 10,
  },
  workInputSec: {
    borderWidth: 1,
    fontSize: 20,
    borderColor: 'gray',
    width: 70,
    borderRadius: 10,
  },
  breakContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
    paddingTop: 15,
  },
  breakInputMin: {
    borderWidth: 1,
    fontSize: 20,
    borderColor: 'gray',
    marginRight: 25,
    width: 70,
    borderRadius: 10,
  },
  breakInputSec: {
    borderWidth: 1,
    fontSize: 20,
    borderColor: 'gray',
    width: 70,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 0.5,
  },
});

export default App;