import React from 'react';

import styled from 'styled-components';
import Popup from 'react-mapbox-gl';

const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`;

class WeatherDetails extends React.Component {

    constructor(props) {
        super(props);
        this.setState({_id:props._id,
            position:props.position})
        console.log(this.position)
        
    }

    render() {
        return<Popup key={this.state._id} coordinates={this.state.position}>
            <StyledPopup>
                <div>id : {this.state._id}</div>
            </StyledPopup>
        </Popup>
    }


}
export default WeatherDetails;