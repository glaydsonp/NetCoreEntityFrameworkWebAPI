import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import Navbar from '../../features/navbar/Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { HomePage } from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

const App: React.FC<RouteComponentProps> = ({ location }) => {


  return (
    <Fragment>
      <Route path='/' component={HomePage} exact></Route>
      <Route path={'/(.+)'} render={() => (
        <Fragment>
          <Navbar />
          <Container style={{ marginTop: '7em' }}>
            <Route path='/activities' component={ActivityDashboard} exact></Route>
            <Route path='/activities/:id' component={ActivityDetails} exact></Route>
            <Route path={['/createActivity', '/edit/:id']} component={ActivityForm} exact key={location.key}></Route>
          </Container>
        </Fragment>
      )}></Route>
    </Fragment>
  );
}

export default withRouter(observer(App));
