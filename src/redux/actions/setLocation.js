import {SET_LOCATION} from '../types';

export function setLocation(granted, long, lat) {
  return {
    type: SET_LOCATION,
    payload: {
      location_granted: granted,
      longitude: long,
      latitude: lat,
    },
  };
}
