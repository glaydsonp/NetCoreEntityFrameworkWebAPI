import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/Activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
  @observable activityRegistry = new Map();

  @observable activities: IActivity[] = [];
  @observable loadingInitial = false;

  @observable activity: IActivity | null = null;

  @observable submitting = false;

  @observable target = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );

    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date = activity.date.split('T')[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as {[key: string]: IActivity[]}));
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

      console.log(this.groupActivitiesByDate(activities));

    } catch (error) {
      console.log(error);

      runInAction('load activities error', () => {
        this.loadingInitial = false;
      });
    }
  }

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = agent.Activities.details(id);

        runInAction('getting activity', () => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      } catch (error) {
        console.log(error);
        runInAction('get activity error', () => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      }
    }
  }

  @action clearActivity = () => {
    this.activity = null;
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);

      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity)
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
        this.activity = activity;
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

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  }
}

export default createContext(new ActivityStore());
