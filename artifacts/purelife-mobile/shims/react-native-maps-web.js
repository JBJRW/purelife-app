import React from "react";
import { View } from "react-native";

const noop = () => null;

const MapView = React.forwardRef(({ children, style }, ref) =>
  React.createElement(View, { style }, children)
);
MapView.displayName = "MapView";

export default MapView;
export const Marker = noop;
export const Polyline = noop;
export const Polygon = noop;
export const Circle = noop;
export const Callout = noop;
export const Overlay = noop;
export const Heatmap = noop;
export const UrlTile = noop;
export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = null;
export const MAP_TYPES = {};
