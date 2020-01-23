import React, { Component } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    values: []
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/values')
      .then(res => {
        this.setState({
          values: res.data
        });
      });
  }

  render() {
    return (
      <div>
        <Header as='h2'>
          <Icon name='users'></Icon>
          <Header.Content>
            Reactivities
          </Header.Content>
        </Header>
        <List>
          <List.Item></List.Item>
          {
            this.state.values.map(
              (value: any) => (
                <List.Item key={value.id}>{value.name}</List.Item>
              )
            )
          }
        </List>
      </div>
    );
  }
}

export default App;