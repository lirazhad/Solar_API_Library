import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { globalStyles } from '../styles/globalStyles';

const SolarData = ({ buildingInsights }) => {
  const [moduleWatts, setModuleWatts] = useState(395);
  const [numModules, setNumModules] = useState(1);
  const [maxModules, setMaxModules] = useState(100);

  useEffect(() => {
    if (buildingInsights?.solarPotential?.maxArrayPanelsCount) {
      setMaxModules(buildingInsights.solarPotential.maxArrayPanelsCount);
    }
  }, [buildingInsights]);

  const totalOutput = ((numModules * moduleWatts) / 1000).toFixed(2);

  if (!buildingInsights) return null;

  return (
    <View style={globalStyles.dataContainer}>
      <Text style={globalStyles.sectionTitle}>Google Solar API Data</Text>
      <Text>Max Module Count: {buildingInsights.solarPotential.maxArrayPanelsCount} modules</Text>
      <Text>Max Annual Sunshine: {Math.round(buildingInsights.solarPotential.maxSunshineHoursPerYear)} hr</Text>
      <Text>Roof Area: {buildingInsights.solarPotential.wholeRoofStats.areaMeters2.toFixed(2)} m²</Text>

      <View style={globalStyles.calculatorRow}>
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.label}>Module output (watts):</Text>
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
            keyboardType="numeric"
            value={moduleWatts.toString()}
            onChangeText={(v) => setModuleWatts(parseInt(v) || 0)}
          />
          <Text style={globalStyles.label}>Modules: {numModules}</Text>
          <Slider
            minimumValue={1}
            maximumValue={maxModules}
            step={1}
            value={numModules}
            onSlidingComplete={setNumModules}
          />
        </View>
        <View style={{ marginLeft: 20 }}>
          <Text style={globalStyles.label}>Total Output:</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{totalOutput} kW</Text>
        </View>
      </View>
    </View>
  );
};

export default SolarData;
