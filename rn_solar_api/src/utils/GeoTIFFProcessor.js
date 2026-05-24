import * as GeoTIFF from 'geotiff';
import proj4 from 'proj4';
import { Buffer } from 'buffer';
import {
  binaryPalette,
  rainbowPalette,
  ironPalette,
  sunlightPalette,
} from '../constants/palettes';

// Note: The original project hardcoded UTM Zone 11N.
// In a production app, the UTM zone should be dynamically determined based on the location.
const DEFAULT_UTM_PROJ = "+proj=utm +zone=11 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

const valueToColor = (value, layerId) => {
  let palette;
  switch (layerId) {
    case "dsm":
      palette = rainbowPalette;
      break;
    case "rgb":
      palette = ironPalette;
      break;
    case "annualFlux":
      palette = ironPalette;
      break;
    case "monthlyFlux":
      palette = ironPalette;
      break;
    case "hourlyShade":
      palette = sunlightPalette;
      break;
    default:
      palette = binaryPalette;
  }

  const index = Math.min(
    palette.length - 1,
    Math.floor(value * palette.length)
  );
  const hexColor = palette[index];

  return {
    r: parseInt(hexColor.substring(0, 2), 16),
    g: parseInt(hexColor.substring(2, 4), 16),
    b: parseInt(hexColor.substring(4, 6), 16),
  };
};

/**
 * Creates a simple 32-bit BMP image from RGBA data to support transparency.
 */
const createBmpBase64 = (width, height, rgbaData) => {
  const pixelDataSize = width * height * 4;
  const fileSize = 54 + pixelDataSize;
  const buffer = Buffer.alloc(fileSize);

  // File Header
  buffer.write('BM', 0);
  buffer.writeInt32LE(fileSize, 2);
  buffer.writeInt32LE(54, 10);

  // Info Header
  buffer.writeInt32LE(40, 14);
  buffer.writeInt32LE(width, 18);
  buffer.writeInt32LE(height, 22);
  buffer.writeInt16LE(1, 26);
  buffer.writeInt16LE(32, 28); // 32 bits for RGBA
  buffer.writeInt32LE(0, 30);
  buffer.writeInt32LE(pixelDataSize, 34);

  // Pixel Data (BMP is bottom-to-top)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rgbaIndex = ((height - 1 - y) * width + x) * 4;
      const r = rgbaData[rgbaIndex];
      const g = rgbaData[rgbaIndex + 1];
      const b = rgbaData[rgbaIndex + 2];
      const a = rgbaData[rgbaIndex + 3];

      const offset = 54 + (y * width + x) * 4;
      buffer[offset] = b;
      buffer[offset + 1] = g;
      buffer[offset + 2] = r;
      buffer[offset + 3] = a;
    }
  }

  return `data:image/bmp;base64,${buffer.toString('base64')}`;
};

export const loadAndProcessGeoTIFF = async (
  url,
  isMask = false,
  layerId = "",
  month = null,
  hour = null,
  maskRasters = null
) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const width = image.getWidth();
    const height = image.getHeight();

    let rastersOptions = {};
    if (layerId === "monthlyFlux") {
      rastersOptions = { samples: [month] };
    }
    const rasters = await image.readRasters(rastersOptions);
    const bbox = image.getBoundingBox();

    let bandData = rasters[0];
    if (layerId === "hourlyShade") {
      bandData = rasters[hour !== null ? hour : 12];
    }

    // Special case for empty hourly shade
    if (layerId === "hourlyShade" && bandData[0] === 0 && bandData[bandData.length - 1] === 0) {
        // Return a fully transparent image
        const transparentRgba = new Uint8Array(width * height * 4).fill(0);
        const sw = proj4(utmZone11N, "EPSG:4326", [bbox[0], bbox[1]]);
        const ne = proj4(utmZone11N, "EPSG:4326", [bbox[2], bbox[3]]);
        return {
          image: createBmpBase64(width, height, transparentRgba),
          bounds: [[sw[1], sw[0]], [ne[1], ne[0]]],
          rasters: null
        };
    }

    let min = bandData[0], max = bandData[0];
    for (let i = 0; i < bandData.length; i++) {
      if (bandData[i] < min) min = bandData[i];
      if (bandData[i] > max) max = bandData[i];
    }

    const rgbaData = new Uint8Array(width * height * 4);
    for (let i = 0; i < bandData.length; i++) {
      let normalizedValue = max === min ? 0 : (bandData[i] - min) / (max - min);
      let color = valueToColor(normalizedValue, layerId);
      let index = i * 4;
      rgbaData[index] = color.r;
      rgbaData[index + 1] = color.g;
      rgbaData[index + 2] = color.b;

      // Apply mask if available
      if (maskRasters && !isMask) {
          rgbaData[index + 3] = maskRasters[0][i];
      } else {
          rgbaData[index + 3] = 255;
      }
    }

    // Convert BBOX from UTM to LatLng
    // TODO: Dynamically determine the projection string based on the GeoTIFF metadata or location.
    const sw = proj4(DEFAULT_UTM_PROJ, "EPSG:4326", [bbox[0], bbox[1]]);
    const ne = proj4(DEFAULT_UTM_PROJ, "EPSG:4326", [bbox[2], bbox[3]]);

    const bounds = [
      [sw[1], sw[0]], // South West [lat, lng]
      [ne[1], ne[0]], // North East [lat, lng]
    ];

    const base64Image = createBmpBase64(width, height, rgbaData);

    return {
      image: base64Image,
      bounds,
      rasters: isMask ? rasters : null,
    };
  } catch (error) {
    console.error("Failed to load or process GeoTIFF:", error);
    throw error;
  }
};
