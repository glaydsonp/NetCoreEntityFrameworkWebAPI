import React, { useState, FormEvent, useContext, useEffect } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/Activity'
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/ActivityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';

interface DetailsParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailsParams>> = ({ match, history }) => {

  const activityStore = useContext(ActivityStore);
  const { createActivity, editActivity, submitting, activity: initialFormState, loadActivity, clearActivity } = activityStore;

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(() => initialFormState && setActivity(initialFormState));
    }

    return () => {
      clearActivity();
    }
  }, [loadActivity, clearActivity, match.params.id, initialFormState]);

  const [activity, setActivity] = useState<IActivity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  });

  const handleInputChange = (event: FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value })
  }

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid()
      }

      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    } else {
      editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    }
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input onChange={handleInputChange} placeholder='Title' name='title' value={activity.title} />
            <Form.TextArea onChange={handleInputChange} rows={2} placeholder='Description' name='description' value={activity.description} />
            <Form.Input onChange={handleInputChange} placeholder='Category' value={activity.category} name='category' />
            <Form.Input onChange={handleInputChange} type='datetime-local' placeholder='Date' value={activity.date} name='date' />
            <Form.Input onChange={handleInputChange} placeholder='City' value={activity.city} name='city' />
            <Form.Input onChange={handleInputChange} placeholder='Venue' value={activity.venue} name='venue' />
            <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
            <Button onClick={() => history.push('/activities')} floated='right' type='button' content='Cancel' />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityForm);
