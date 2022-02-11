import React from 'react';
import {fetchData} from '../../apis/SkipTheDishes';
import Button from '../atoms/SelectionButton';
import sessionStore from '../../redux/sessionStore';

const fetchOptions = async () => {
  const long = sessionStore.getState().host.longitude;
  const lat = sessionStore.getState().host.latitude;

  if (sessionStore.getState().host.granted) {
    return await fetchData(lat, long);
  } else {
    return [];
  }
};

class SuggestionButtons extends React.Component {
  constructor() {
    super();
    this.state = {returnData: []};
  }

  async componentDidMount() {
    try {
      this.setState({returnData: await fetchOptions()});
    } catch (err) {
      // handle errors
    }
  }

  render() {
    const {returnData} = this.state;
    return returnData.map(x => {
      return <Button text={x.name} />;
    });
  }
}

export default SuggestionButtons;
