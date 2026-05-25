import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, ScrollView, Alert, View } from 'react-native';
import { globalStyles } from './src/styles/globalStyles';
import Header from './src/components/Header';
import AddressSearch from './src/components/AddressSearch';
import SolarMap from './src/components/SolarMap';
import Controls from './src/components/Controls';
import SolarData from './src/components/SolarData';
import { getLatLongFromAddress, getDataLayers, findClosestBuildingInsights } from './src/services/SolarApiService';
import { loadAndProcessGeoTIFF } from './src/utils/GeoTIFFProcessor';
import { layerTypes, apiKey } from './src/constants/palettes';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [region, setRegion] = useState({
    latitude: 32.7720012,
    longitude: -117.0726966,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  });
  const [buildingInsights, setBuildingInsights] = useState(null);
  const [dataLayers, setDataLayers] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [maskRasters, setMaskRasters] = useState(null);

  const [selectedLayer, setSelectedLayer] = useState(2); // Default to Annual Flux
  const [selectedMonth, setSelectedMonth] = useState(6); // July
  const [selectedHour, setSelectedHour] = useState(12); // 12 PM
  const [displayOverlay, setDisplayOverlay] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'Kameron': { uri: 'https://fonts.gstatic.com/s/kameron/v25/0yb9GD49J1zRVo694_0.ttf' },
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleSearch = async (address) => {
    try {
      const location = await getLatLongFromAddress(address);
      const newRegion = {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      };
      setRegion(newRegion);

      const insights = await findClosestBuildingInsights(location.lat, location.lng);
      setBuildingInsights(insights);

      const layers = await getDataLayers(location.lat, location.lng);
      setDataLayers(layers);

      if (layers.maskUrl) {
          const maskResult = await loadAndProcessGeoTIFF(layers.maskUrl + `&key=${apiKey}`, true);
          setMaskRasters(maskResult.rasters);
      }

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    const updateOverlay = async () => {
      if (!dataLayers || !displayOverlay) {
        setOverlay(null);
        return;
      }

      const layerType = layerTypes[selectedLayer];
      let url = "";

      if (layerType === "dsm") url = dataLayers.dsmUrl;
      else if (layerType === "rgb") url = dataLayers.rgbUrl;
      else if (layerType === "annualFlux") url = dataLayers.annualFluxUrl;
      else if (layerType === "monthlyFlux") url = dataLayers.monthlyFluxUrl;
      else if (layerType === "hourlyShade") url = dataLayers.hourlyShadeUrls[selectedMonth];

      if (url) {
        try {
          const result = await loadAndProcessGeoTIFF(
            url + `&key=${apiKey}`,
            false,
            layerType,
            selectedMonth,
            selectedHour,
            maskRasters
          );
          setOverlay(result);
        } catch (error) {
          console.error("Overlay update error:", error);
        }
      }
    };

    updateOverlay();
  }, [dataLayers, selectedLayer, selectedMonth, selectedHour, displayOverlay, maskRasters]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView style={globalStyles.container} onLayout={onLayoutRootView}>
      <StatusBar style="auto" />
      <Header />
      <ScrollView>
        <AddressSearch onSearch={handleSearch} />
        <SolarMap region={region} overlay={overlay} />
        <Controls
          selectedLayer={selectedLayer}
          setSelectedLayer={setSelectedLayer}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          displayOverlay={displayOverlay}
          setDisplayOverlay={setDisplayOverlay}
        />
        <SolarData buildingInsights={buildingInsights} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
