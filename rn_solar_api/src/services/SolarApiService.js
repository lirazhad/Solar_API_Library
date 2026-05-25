import { apiKey } from '../constants/palettes';

export const findClosestBuildingInsights = async (latitude, longitude) => {
  const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&requiredQuality=HIGH&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching building insights:", error);
    throw error;
  }
};

export const getLatLongFromAddress = async (address) => {
  const formattedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "OK") {
      return data.results[0].geometry.location;
    } else {
      throw new Error("Geocoding failed: " + data.status);
    }
  } catch (error) {
    console.error("Error geocoding address:", error);
    throw error;
  }
};

export const getDataLayers = async (latitude, longitude) => {
  const params = new URLSearchParams({
    'location.latitude': latitude,
    'location.longitude': longitude,
    'radiusMeters': '100',
    'view': 'FULL_LAYERS',
    'requiredQuality': 'HIGH',
    'pixelSizeMeters': '0.5',
    'key': apiKey
  });

  const url = `https://solar.googleapis.com/v1/dataLayers:get?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data layers:", error);
    throw error;
  }
};
