import polyline  =  require("@mapbox/polyline");
import { Position } from "../types";

const POLYLINE_PRECISION = 6;

export const Polyline = {
  encode: (coordinates: Position[]) => {
    // The positions are constructed using longitude and latitude precisely in that order.
    const positions: Array<[number, number]> = coordinates.map(coordinate => [
      coordinate.longitude,
      coordinate.latitude,
    ]);
    return polyline.encode(positions, POLYLINE_PRECISION);
  },
};
