import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/Activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
  @observable activityRegistry = new Map();

  @observable activities: IActivity[] = [];
  @observable loadingInitial = false;

  @observable selectedActivity: IActivity | undefined;
  @observable editMode = false;

  @observable submitting = false;

  @observable target = '';

  @computed get activitiesByDate() {
    return Array.from(
      this.activityRegistry.values()).sort(
        (a, b) => Date.parse(a.date) - Date.parse(b.date)
      );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activities = await agent.Activities.list();

      runInAction('loading activities', () => {
        activities.forEach((activity: IActivity) => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
        });

        this.loadingInitial = false;
      });

    } catch (error) {
      console.log(error);

      runInAction('load activities error', () => {
        this.loadingInitial = false;
      });
    }
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);

      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction('create activity error', () => {
        this.submitting = false;
      });
    }
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('update activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction('update activity error', () => {
        this.submitting = false;
      });
    }
  }

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      console.log(error);
      runInAction('delete activity error', () => {
        this.submitting = false;
        this.target = '';
      });
    }
  }

  @action openEditFrom = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  }

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  @action cancelFormOpen = () => {
    this.editMode = false;
  }

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  }

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  }
}

export default createContext(new ActivityStore());
