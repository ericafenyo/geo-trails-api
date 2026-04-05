/**
 * A position is used to construct the "coordinates" member of a Geometry object.
 * The first two elements are longitude and latitude precisely in that order and using decimal numbers.
 */

export type Position = {
  longitude: number;
  latitude: number;
};
