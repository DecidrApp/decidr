export function setLocation(granted, long, lat) {
  return {
    type: 'SET_LOCATION',
    payload: {
      granted: granted,
      longitude: long,
      latitude: lat,
    },
  };
}
