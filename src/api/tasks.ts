import './client';

import {
  tasksControllerApproveTask,
  tasksControllerCancelTask,
  tasksControllerCreateTask,
  tasksControllerGetTaskById,
  tasksControllerGetTasks,
  tasksControllerRejectTask,
  tasksControllerRequestNewTask,
  tasksControllerSubmitTask,
  tasksControllerUpdateTask,
} from './gen/clients';
import type { CreateTaskDto } from './gen/models/CreateTaskDto';
import type { SubmitTaskDto } from './gen/models/SubmitTaskDto';
import type { TasksControllerGetTasksStatusKey } from './gen/models/TasksControllerGetTasks';
import type { UpdateTaskDto } from './gen/models/UpdateTaskDto';

export async function fetchTasks(status?: TasksControllerGetTasksStatusKey) {
  return tasksControllerGetTasks(status ? { query: { status } } : {});
}

export async function fetchTask(id: string) {
  return tasksControllerGetTaskById({ path: { id } });
}

export async function createTask(input: CreateTaskDto) {
  return tasksControllerCreateTask({ body: input });
}

export async function updateTask(id: string, input: UpdateTaskDto) {
  return tasksControllerUpdateTask({ path: { id }, body: input });
}

export async function requestNewTask(comment?: string) {
  return tasksControllerRequestNewTask({ body: { comment } });
}

export async function submitTask(taskId: string, input: SubmitTaskDto = {}) {
  return tasksControllerSubmitTask({ path: { id: taskId }, body: input });
}

export async function approveTask(taskId: string) {
  return tasksControllerApproveTask({ path: { id: taskId } });
}

export async function rejectTask(taskId: string, reason: string) {
  return tasksControllerRejectTask({ path: { id: taskId }, body: { reason } });
}

export async function cancelTask(taskId: string) {
  return tasksControllerCancelTask({ path: { id: taskId } });
}
