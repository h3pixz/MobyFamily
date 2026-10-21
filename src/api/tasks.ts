import './client';

import { tasksControllerGetTasks, tasksControllerSubmitTask } from './gen/clients';

export async function fetchTasks() {
  return tasksControllerGetTasks({});
}

export async function submitTask(taskId: string) {
  return tasksControllerSubmitTask({ path: { id: taskId }, body: {} });
}
