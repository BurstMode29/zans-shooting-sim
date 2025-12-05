import React from 'react'

import {
    LineChart,
  } from 'react-native-chart-kit'

//  Config
import Layout from '../../config/layout'
import Colors from '../../config/colors'

  export default function Line ({ labels, datasets }){
      return(
        <LineChart
        data={{
          labels,
          datasets
        }}
        width={Layout.fullscreen.width - 280} // from react-native
        height={220}
        yAxisLabel={''}
        chartConfig={{
          backgroundColor: Colors.primary,
          backgroundGradientFrom:  Colors.primary,
          backgroundGradientTo:  Colors.primary,
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
      )
  }