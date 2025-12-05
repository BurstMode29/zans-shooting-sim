import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

//  Assets
import TargetImage from "../../assets/shooting-target.png"

//  Config
import Layout from '../../config/layout'
import Colors from '../../config/colors'

//  Components
import Line from '../../components/graphs/Line'

//  Consts
const TARGET_WIDTH = 400
const TARGET_HEIGHT = 400
const SHOT_DIAMATER = 20
const SHOT_X_SCALE = 0.4
const SHOT_Y_SCALE = 0.4
const TARGET_LEFT_OFFSET = ((Layout.fullscreen.width - TARGET_WIDTH) / 2) - 143

const Shot = ({ x, y, index }) => {
  return (
    <View
      style={[
        styles.shot,
        {
          left: TARGET_WIDTH / 2 - SHOT_DIAMATER / 2 + TARGET_LEFT_OFFSET + x,
          top: TARGET_HEIGHT / 2 - SHOT_DIAMATER / 2 - y
        }
      ]}
    >
      <View style={styles.shotInner} ><Text style={{color: 'lightgrey', marginTop: 13, width: 20}}>{index + 1}</Text></View>
    </View>
  )
}



export default function TimetrailSessionDetail ({sessionData}) {
    return (
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainerStyle}>
            <View style={styles.topCardContainer}>

                <View style={styles.topCard}>
                    <Text style={styles.topcardTitle}>Avg. Accuracy</Text>
                    <Text style={styles.topcardValue}>{`${sessionData.accuracy}%`}</Text>
                </View>

                <View style={styles.topCard}>
                    <Text style={styles.topcardTitle}>Shooter</Text>
                    <Text style={styles.topcardValue}>{sessionData.shooterName}</Text>
                </View>

                <View style={styles.topCard}>
                    <Text style={styles.topcardTitle}>Total shots</Text>
                    <Text style={styles.topcardValue}>{sessionData.shots.length}</Text>
                </View>

                <View style={styles.topCard}>
                    <Text style={styles.topcardTitle}>Difficulty</Text>
                    <Text style={styles.topcardValue}>{`${sessionData.diffFactor < 0.5 ? 'Very Easy' : sessionData.diffFactor < 0.9 ? 'Easy' : 'Realistic'}`}</Text>
                </View>

            </View>

            <View style={styles.targetPreviewContainer}>
            <Image source={TargetImage} style={styles.target} />
            {sessionData.shots.map((shot, index) => {
              return <Shot x={shot.x - (shot.x * SHOT_X_SCALE)} y={shot.y - (shot.y * SHOT_Y_SCALE)} key={index} index={index} />
            })}
            </View>

            <Text style={styles.graphTitle}> Accuracy </Text> 
            <Text style={styles.graphSubtitle}> Percentage accuracy per shot. </Text> 
             <Line
              labels={sessionData.shots.map((shot, index) => {return `${index + 1}`})}
              datasets={[{
                  data: sessionData.shots.map((shot, index) => {return shot.accuracy})
              }]}
            />
             <Text style={styles.graphTitle}> Shot Placement </Text> 
             <Text style={styles.graphSubtitle}> X and Y coordinates per shot, 0 is center of target. </Text> 
             <Line
              labels={sessionData.shots.map((shot, index) => {return `${index + 1}`})}
              datasets={[{
                  data: sessionData.shots.map((shot, index) => {return shot.x})
              },{
                data: sessionData.shots.map((shot, index) => {return shot.y})
            }]}
            />
             <Text style={styles.graphTitle}> Shot Stability </Text> 
             <Text style={styles.graphSubtitle}> X, Y and Z gyroscope readings per shot. Less variation means more stability. </Text> 
             <Line
              labels={sessionData.shots.map((shot, index) => {return `${index + 1}`})}
              datasets={[{
                  data: sessionData.shots.map((shot, index) => {return shot.gyr.x})
              },{
                data: sessionData.shots.map((shot, index) => {return shot.gyr.y})
            },{
                data: sessionData.shots.map((shot, index) => {return shot.gyr.z})
            }]}
            />

              <Text style={styles.graphTitle}> Shot Steadiness </Text> 
             <Text style={styles.graphSubtitle}> X, Y and Z accelerometer readings per shot. Less variation means more stability. </Text> 
             <Line
              labels={sessionData.shots.map((shot, index) => {return `${index + 1}`})}
              datasets={[{
                  data: sessionData.shots.map((shot, index) => {return shot.acc.x})
              },{
                data: sessionData.shots.map((shot, index) => {return shot.acc.y})
            },{
                data: sessionData.shots.map((shot, index) => {return shot.acc.z})
            }]}
            />


      </ScrollView>
    );
}

const styles = StyleSheet.create({
    content:{
        width: Layout.fullscreen.width -250,
        height: Layout.fullscreen.height,
      },
      contentContainerStyle:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 100
      },
      topCardContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: Layout.fullscreen.width -250,
        paddingHorizontal: 15,
        marginBottom: 15
      },
      topCard:{
        width: 125,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5
      },
      topcardTitle:{
        color:'white',
        fontSize: 15,
        opacity: 0.6
      },
      topcardValue:{
        color:'white',
        fontSize: 22,
      },
    graphTitle:{
        width: Layout.fullscreen.width -280,
        color:'white',
        fontSize: 20,
        marginLeft: 10
      },
      graphSubtitle:{
        width: Layout.fullscreen.width -280,
        color:'white',
        fontSize: 13,
        marginLeft: 10,
        opacity: 0.6
      },
      targetPreviewContainer:{
        width: Layout.fullscreen.width -280,
        ...Layout.center
      },
      target:{
        height: TARGET_HEIGHT,
        width: TARGET_WIDTH
      },
      shot: {
        height: SHOT_DIAMATER,
        width: SHOT_DIAMATER,
        backgroundColor: "rgba(209, 0, 0, 0.69)",
        borderRadius: 15,
        position: "absolute",
        ...Layout.center
      },
      shotInner: {
        backgroundColor: "rgba(255, 31, 31, 1)",
        height: 8,
        width: 8,
        borderRadius: 4
      },
})