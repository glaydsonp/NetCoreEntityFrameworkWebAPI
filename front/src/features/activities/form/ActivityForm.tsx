import React, { useState, FormEvent, useContext } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/Activity'
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/ActivityStore';
import { observer } from 'mobx-react-lite';

interface IProps {
  activity: IActivity | null;
}

const ActivityForm: React.FC<IProps> = ({ activity: initialFormState }) => {

  const activityStore = useContext(ActivityStore);
  const { createActivity, editActivity, submitting, cancelFormOpen } = activityStore;

  const initializeForm = (): IActivity => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
      }
    }
  }

  const [activity, setActivity] = useState<IActivity>(initializeForm);

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

      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input onChange={handleInputChange} placeholder='Title' name='title' value={activity.title} />
        <Form.TextArea onChange={handleInputChange} rows={2} placeholder='Description' name='description' value={activity.description} />
        <Form.Input onChange={handleInputChange} placeholder='Category' value={activity.category} name='category' />
        <Form.Input onChange={handleInputChange} type='datetime-local' placeholder='Date' value={activity.date} name='date' />
        <Form.Input onChange={handleInputChange} placeholder='City' value={activity.city} name='city' />
        <Form.Input onChange={handleInputChange} placeholder='Venue' value={activity.venue} name='venue' />
        <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
        <Button onClick={() => cancelFormOpen()} floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
  )
}

export default observer(ActivityForm);
