export const apiKey = "{INSERT_API_KEY}";

export const binaryPalette = ["212121", "B3E5FC"];
export const rainbowPalette = ["3949AB", "81D4FA", "66BB6A", "FFE082", "E53935"];
export const ironPalette = ["00000A", "91009C", "E64616", "FEB400", "FFFFF6"];
export const sunlightPalette = ["212121", "FFCA28"];

export const dataLayerOptions = [
  { id: "none", name: "No layer" },
  { id: "mask", name: "Roof mask" },
  { id: "dsm", name: "Digital Surface Model" },
  { id: "rgb", name: "Aerial image" },
  { id: "annualFlux", name: "Annual sunshine" },
  { id: "monthlyFlux", name: "Monthly sunshine" },
  { id: "hourlyShade", name: "Hourly shade" },
];

export const layerTypes = ["dsm", "rgb", "annualFlux", "monthlyFlux", "hourlyShade"];

export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const hourNames = [
  "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
  "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM",
];
