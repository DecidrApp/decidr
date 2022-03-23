const axios = require('axios');

const API_HOST_AND_PATH =
  'https://api.skipthedishes.com/customer/v1/graphql?isCuisineSearch=false&isSorted=false&search=';

const CONST_API_HEADERS = {
  'App-Token': 'd7033722-4d2e-4263-9d67-d83854deb0fc',
};

const CONST_BODY = {
  operationName: 'QueryRestaurantsCuisinesList',
  variables: {
    isDelivery: true,
    language: 'en',
  },
  extensions: {
    persistedQuery: {
      version: 1,
      sha256Hash:
        '4e7d2eb1155cc0e8dd416ca5de9ac3d848059614580c10b8dbd3b9d56e1a9b9a',
    },
  },
};

// Call the API
function callApi(latitude, longitude, search) {
  // Parse the data
  function parseData(data) {
    return data.map(x => {
      return {
        id: x?.id,
        name: x?.name,
        tags: x?.cuisines,
        distance:
          x?.distance?.unit === 'KM'
            ? x?.distance?.value
            : x?.distance?.value * 1000,
        imageUrls: x?.imageUrls,
        cleanUrl: x?.cleanUrl,
      };
    });
  }

  return axios
    .request({
      url: API_HOST_AND_PATH,
      method: 'POST',
      headers: CONST_API_HEADERS,
      data: {
        ...CONST_BODY,
        ...{
          variables: {
            latitude: latitude,
            longitude: longitude,
            search: search,
          },
        },
      },
    })
    .then(r => {
      if (r?.data?.data?.restaurantsList?.openRestaurants) {
        return parseData(r?.data?.data?.restaurantsList?.openRestaurants);
      } else {
        return [];
      }
    })
    .catch(r => {
      // TODO: Failed for some reason, handle it better?
      console.warn('Unable to fetch from SkipTheDishes');
      console.warn(r);
      return [];
    });
}

/*
    Arguments: latitude - Double - Decimal latitude of location
               longitude - Double - Decimal longitude of location
               search - String - Search string to pass to API

    Returns: Array[Object] - Each object will contain: name{String},
                                                       tags{Array[String]},
                                                       distance{Number},
                                                       imageUrls{Object}
 */
function fetchData(latitude, longitude, search = '') {
  return callApi(latitude, longitude, search);
}

export {fetchData};
