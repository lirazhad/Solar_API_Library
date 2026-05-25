import React from 'react';
import { View, Text, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { globalStyles } from '../styles/globalStyles';
import { dataLayerOptions, monthNames, hourNames } from '../constants/palettes';

const Controls = ({
  selectedLayer,
  setSelectedLayer,
  selectedMonth,
  setSelectedMonth,
  selectedHour,
  setSelectedHour,
  displayOverlay,
  setDisplayOverlay,
}) => {
  return (
    <View style={globalStyles.controls}>
      <View style={globalStyles.controlRow}>
        <View style={globalStyles.controlItem}>
          <Text style={globalStyles.label}>Select Layer:</Text>
          <Picker
            selectedValue={selectedLayer}
            onValueChange={(itemValue) => setSelectedLayer(itemValue)}
          >
            {dataLayerOptions.map((option, index) => (
              <Picker.Item key={option.id} label={option.name} value={index} />
            ))}
          </Picker>
        </View>
        <View style={[globalStyles.controlItem, { alignItems: 'center' }]}>
          <Text style={globalStyles.label}>Display Overlay</Text>
          <Switch value={displayOverlay} onValueChange={setDisplayOverlay} />
        </View>
      </View>

      <View style={globalStyles.controlRow}>
        <View style={globalStyles.controlItem}>
          <Text style={globalStyles.label}>Month: {monthNames[selectedMonth]}</Text>
          <Slider
            minimumValue={0}
            maximumValue={11}
            step={1}
            value={selectedMonth}
            onSlidingComplete={setSelectedMonth}
          />
        </View>
        <View style={globalStyles.controlItem}>
          <Text style={globalStyles.label}>Hour: {hourNames[selectedHour]}</Text>
          <Slider
            minimumValue={0}
            maximumValue={23}
            step={1}
            value={selectedHour}
            onSlidingComplete={setSelectedHour}
          />
        </View>
      </View>
    </View>
  );
};

export default Controls;
