// Todo: split into small files like the Task Reducer.

import { ProjectDetails } from './../../../models/projects/project-details.model';
import { Stage } from './../../../models/projects/stage.model';
import {
  Task, TasksPayload, Todo, TaskAttachmentParams,
  AttachmentCountActionType,
} from './../../../models/tasks/task.model';
import { CommentActionType } from './../../../models/task-comment/task-comment.model';
import { Board } from './../../../models/projects/board.model';
import { Reducer, updateState } from '../../../actions-utils';
import {
  ADD_STAGE,
  ADD_STAGE_ERROR,
  ADD_STAGE_SUCCESS,
  ADD_TASK,
  ADD_TASK_ERROR,
  ADD_TASK_SUCCESS,
  ARCHIVE_PROJECT,
  ARCHIVE_PROJECT_ERROR,
  ARCHIVE_PROJECT_SUCCESS,
  CREATE_PROJECT,
  CREATE_PROJECT_ERROR,
  CREATE_PROJECT_SUCCESS,
  DEFAULT,
  DELETE_PROJECT,
  DELETE_PROJECT_ERROR,
  DELETE_PROJECT_SUCCESS,
  DELETE_TASK_FROM_PROJECT,
  DELETE_TASK_FROM_PROJECT_ERROR,
  DELETE_TASK_FROM_PROJECT_SUCCESS,
  DroppedTaskLocator,
  FETCH_PROJECT,
  FETCH_PROJECT_ERROR,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECTS,
  FETCH_PROJECTS_ERROR,
  FETCH_PROJECTS_SUCCESS,
  LOAD_MORE_TASKS,
  LOAD_MORE_TASKS_ERROR,
  LOAD_MORE_TASKS_SUCCESS,
  NewTask,
  ProjectAction,
  ProjectData,
  REMOVE_FROM_FETCHED_PROJECTS,
  REMOVE_PROJECTS_INVITEE,
  REMOVE_PROJECTS_INVITEE_ERROR,
  REMOVE_PROJECTS_INVITEE_SUCCESS,
  REMOVE_STAGE,
  REMOVE_STAGE_ERROR,
  REMOVE_STAGE_SUCCESS,
  RESET_SUBSTATES,
  StageLocator,
  TASK_DROPPED,
  TASK_DROPPED_ERROR,
  TASK_DROPPED_SUCCESS,
  TaskCommentParams,
  TodoActionType,
  TodoParams,
  UPDATE_PROJECT,
  UPDATE_PROJECT_ERROR,
  UPDATE_PROJECT_SUCCESS,
  UPDATE_PROJECTS_INVITEE,
  UPDATE_PROJECTS_INVITEE_ERROR,
  UPDATE_PROJECTS_INVITEE_SUCCESS,
  UPDATE_STAGE_NAME,
  UPDATE_STAGE_NAME_ERROR,
  UPDATE_STAGE_NAME_SUCCESS,
  UPDATE_TASK_DATES,
  UPDATE_TASK_NAME,
  UPDATE_TASK_STATUS,
  UPDATE_TASK_ATTACHMENTS_COUNT,
  UPDATE_TASK_COMMENTS_COUNT,
  UPDATE_TASK_TODOS_COUNT,
  UPDATE_TASK_TRACKED_TIME,
  UPDATE_TASK_USERS,
  UPDATE_TASK_DESCRIPTION,
} from '../actions/project.actions';
import { TaskParams } from './../../tasks/actions/task.actions';
import {
  assoc, dec, evolve, find, flatten, flip, identity, inc, length, map, merge,
  partition, path, pick, pipe, prop, propEq, propOr, subtract, uniqBy, when, isNil,
  prepend, append,
} from 'ramda';
import { mapWhenPropsEq } from './../../../helpers/map-when-props-eq';
import { mergeWithBaseItem } from './../../tasks/utils/utils-reducers';

export interface ProjectStateItem {
  error: boolean;
  errorData: any;
  pending: boolean;
  success: boolean;
  value?: any;
}

export interface ProjectState {
  addStage: ProjectStateItem;
  removeStage: ProjectStateItem;
  updateStageName: ProjectStateItem;
  loadMoreTasks: ProjectStateItem;
  fetchProject: ProjectStateItem;
  fetchProjects: ProjectStateItem;
  archiveProject: ProjectStateItem;
  deleteProject: ProjectStateItem;
  createProject: ProjectStateItem;
  updateProject: ProjectStateItem;
  updateProjectsInvitee: ProjectStateItem;
  removeProjectsInvitee: ProjectStateItem;
  taskDropped: ProjectStateItem;
  addTask: ProjectStateItem;
  deleteTaskFromProject: ProjectStateItem;
}

function initialStateItem(valuePresent: boolean = true): ProjectStateItem {
  const baseObj = {
    error: false,
    errorData: null,
    pending: false,
    success: false,
  };
  return valuePresent ? { ...baseObj, value: null } : baseObj;
}

export const initialState: ProjectState = {
  addStage: initialStateItem(false),
  removeStage: initialStateItem(false),
  updateStageName: initialStateItem(false),
  loadMoreTasks: initialStateItem(false),
  updateProject: initialStateItem(false),
  updateProjectsInvitee: initialStateItem(false),
  removeProjectsInvitee: initialStateItem(false),
  fetchProject: initialStateItem(),
  fetchProjects: initialStateItem(),
  archiveProject: initialStateItem(),
  deleteProject: initialStateItem(),
  createProject: initialStateItem(),
  taskDropped: initialStateItem(),
  addTask: initialStateItem(),
  deleteTaskFromProject: initialStateItem(),
};

type ProjectReducer = Reducer<ProjectState, ProjectAction>;

const addStageReducer: ProjectReducer = (state, _) =>
  updateState(state, 'addStage', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const addStageSuccessReducer: ProjectReducer = (state, action) => {
  const stage: Stage = action.payload;

  const project = state.fetchProject.value;

  function insertStageInSwimlane(swimlane) {
    return {
      ...swimlane,
      stages: swimlane.stages.concat({
        ...stage,
        cards: [ ...stage.cards ],
      }),
    };
  }

  const swimlanes = project.swimlanes.map(insertStageInSwimlane);

  const tempState = updateState(state, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: { ...project, swimlanes },
  });

  return updateState(tempState, 'addStage', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
  });
};

const addStageErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'addStage', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

const removeStageReducer: ProjectReducer = (state, _) =>
  updateState(state, 'removeStage', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const removeStageSuccessReducer: ProjectReducer = (state, action) => {
  const stageLocator: StageLocator = action.payload;

  const project = state.fetchProject.value;

  function removeStageFromSwimlane(swimlane) {
    return {
      ...swimlane,
      stages: swimlane.stages.filter(s => s.id !== stageLocator.stageId),
    };
  }

  const swimlanes = project.swimlanes.map(removeStageFromSwimlane);

  const tempState = updateState(state, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: { ...project, swimlanes },
  });

  return updateState(tempState, 'removeStage', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
  });
};

const removeStageErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'removeStage', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

const updateStageNameReducer: ProjectReducer = (state, _) =>
  updateState(state, 'updateStageName', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const updateStageNameSuccessReducer: ProjectReducer = (state, action) => {
  const stageLocator: StageLocator = action.payload;

  const project = state.fetchProject.value;

  function findStageAndChangeName(stage: Stage): Stage {
    return stage.id !== stageLocator.stageId ? stage : { ...stage, name: stageLocator.stageName };
  }

  function updateStagesInSwimlane(swimlane) {
      return {
        ...swimlane,
        stages: swimlane.stages.map(findStageAndChangeName),
      };
    }

  const swimlanes = project.swimlanes.map(updateStagesInSwimlane);

  const tempState = updateState(state, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: { ...project, swimlanes },
  });

  return updateState(tempState, 'updateStageName', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
  });
};

const updateStageNameErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'updateStageName', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

const fetchProjectReducer: ProjectReducer = (state, action) =>
  updateState(state, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const fetchProjectSuccessReducer: ProjectReducer = (state, action) =>
  updateState(state, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const fetchProjectErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'fetchProject', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const loadMoreTasksReducer: ProjectReducer = (state, _) =>
  updateState(state, 'loadMoreTasks', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const loadMoreTasksSuccessReducer: ProjectReducer = (state, action) => {
  const resp: TasksPayload = action.payload;

  const project = state.fetchProject.value;

  function updateCardsInStage(stage: Stage): Stage {
    const newStage = { ...stage };
    if (resp.cards.length > 0) {
      newStage.cards = uniqBy(item => item.id, stage.cards.concat(resp.cards));
    }
    if (resp.last_page) {
      newStage.load_more = false;
    } else {
      newStage.page++;
    }
    return newStage;
  }

  function updateStagesInSwimlane(swimlane) {
    const stages: Stage[] = swimlane.stages.map((stage: Stage) =>
      stage.id !== resp.stageId ? stage : updateCardsInStage(stage)
    );

    return { ...swimlane, stages };
  }

  const swimlanes = project.swimlanes.map((swimlane) =>
    swimlane.id !== resp.swimlaneId ? swimlane : updateStagesInSwimlane(swimlane)
  );

  const tempState = updateState(state, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: { ...project, swimlanes },
  });

  return updateState(tempState, 'loadMoreTasks', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
  });
};

const loadMoreTasksErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'loadMoreTasks', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

const fetchProjectsReducer: ProjectReducer = (state, action) =>
  updateState(state, 'fetchProjects', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const fetchProjectsSuccessReducer: ProjectReducer = (state, action) =>
  updateState(state, 'fetchProjects', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const fetchProjectsErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'fetchProjects', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const removeFromFetchedProjectsReducer: ProjectReducer = (state, action) => {
  const currentWorkspace = (board: Board): boolean => board.workspace_id === action.payload.workspaceId;

  const updateProjects = (board: Board): Board => {
    const projects = board.projects.filter(project => project.id !== action.payload.projectId);
    return { ...board, projects };
  };

  const updateCurrentBoard = when(currentWorkspace, updateProjects);

  const boards: Board[] = state.fetchProjects.value.map(updateCurrentBoard);

  return updateState(state, 'fetchProjects', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: boards,
  });
};

const archiveProjectReducer: ProjectReducer = (state, action) =>
  updateState(state, 'archiveProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const archiveProjectSuccessReducer: ProjectReducer = (state, action) =>
  updateState(state, 'archiveProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const archiveProjectErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'archiveProject', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const deleteProjectReducer: ProjectReducer = (state, action) =>
  updateState(state, 'deleteProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const deleteProjectSuccessReducer: ProjectReducer = (state, action) =>
  updateState(state, 'deleteProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const deleteProjectErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'deleteProject', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const createProjectReducer: ProjectReducer = (state, action) =>
  updateState(state, 'createProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const createProjectSuccessReducer: ProjectReducer = (state, action) => {
  const inputProject = action.payload.inputPayload;
  const serverResponseProject = action.payload.serverPayload;
  const workspacesList = state.fetchProjects.value;

  const updatedWorkspaces = workspacesList.map((workspace) => {
    if (workspace.workspace_id === inputProject.workspace_id ||
        workspace.workspace_id === 0 && inputProject.workspace_id === null) {
      return {
        ...workspace,
        projects: workspace.projects.concat(serverResponseProject),
      };
    }
    return workspace;
  });

  const projectsState = updateState(state, 'fetchProjects', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: updatedWorkspaces,
  });

  return updateState(projectsState, 'createProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
  });
};

const createProjectErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'createProject', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const updateProjectReducer: ProjectReducer = (state, _) =>
  updateState(state, 'updateProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const updateProjectSuccessReducer: ProjectReducer = (state, action) => {
  const newProject: ProjectData = action.payload;
  const workspacesList = state.fetchProjects.value;
  let currentProject = state.fetchProject.value;
  let updatedWorkspaces: any[];

  const workspaceChanged = newProject.workspace_id !== currentProject.workspace_id;

  currentProject  =  { ...currentProject, name: newProject.name, workspace_id: newProject.workspace_id };
  const fetchProjState = updateState(state, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: currentProject,
  });

  const projectToMove = pipe(
    map(prop('projects')),
    flatten,
    find(propEq('id', currentProject.id))
  )(workspacesList);

  if (workspaceChanged) {
    updatedWorkspaces = workspacesList.map((workspace) => {
      if (workspace.workspace_id === currentProject.workspace_id) {
        return { ...workspace, projects: workspace.projects.concat(projectToMove) };
      }
      return { ...workspace, projects: workspace.projects.filter(project => currentProject.id !== project.id) };
    });
  } else {
    updatedWorkspaces = workspacesList.map((workspace) => {
      if (workspace.workspace_id === currentProject.workspace_id) {
        return { ...workspace, projects: workspace.projects.map(project => {
          if (project.id === currentProject.id) {
            return { ...project, name: currentProject.name };
          }
          return project;
        }) };
      }
      return workspace;
    });
  }

  const projectsState = updateState(fetchProjState, 'fetchProjects', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: updatedWorkspaces,
  });

  return updateState(projectsState, 'updateProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
  });
};

const updateProjectErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'updateProject', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const updateProjectsInviteeReducer: ProjectReducer = (state, action) =>
  updateState(state, 'updateProjectsInvitee', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const updateProjectsInviteeSuccessReducer: ProjectReducer = (state, action) => {
  const userToBeAdded = action.payload.invitees;
  const currentProject = state.fetchProject.value;
  const projectUsers = currentProject.users;

  const updatedProjectUsers = projectUsers.map(user =>
    ({ ...user, assigned: userToBeAdded === user.email || user.assigned })
  );

  const tempState = updateState(state, 'updateProjectsInvitee', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
  });

  return updateState(tempState, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: { ...currentProject, users: updatedProjectUsers },
  });
};

const updateProjectsInviteeErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'updateProjectsInvitee', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const removeProjectsInviteeReducer: ProjectReducer = (state, _) =>
  updateState(state, 'removeProjectsInvitee', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const removeProjectsInviteeSuccessReducer: ProjectReducer = (state, action) => {
  const userToBeRemoved = action.payload.userId;
  const projectUsers = state.fetchProject.value.users;
  const currentProject = state.fetchProject.value;

  const updatedProjectUsers = projectUsers.map(user =>
    ({ ...user, assigned: userToBeRemoved === user.id ? false : user.assigned })
  );

  const tempState = updateState(state, 'removeProjectsInvitee', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
  });

  return updateState(tempState, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: { ...currentProject, users: updatedProjectUsers },
  });
};

const removeProjectsInviteeErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'removeProjectsInvitee', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

const taskDroppedReducer: ProjectReducer = (state, action) =>
  updateState(state, 'taskDropped', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const taskDroppedSuccessReducer: ProjectReducer = (state, action) => {
  const droppedTaskLocator: DroppedTaskLocator = action.payload;

  return updateState(state, 'taskDropped', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: droppedTaskLocator,
  });
};

const taskDroppedErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'taskDropped', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const addTaskReducer: ProjectReducer = (state, action) =>
  updateState(state, 'addTask', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const addTaskSuccessReducer: ProjectReducer = (state, action) => {
  const task: NewTask|Task = action.payload;
  const project: ProjectDetails = state.fetchProject.value;
  const addLast = task.addLast;

  if (project == null) {
    return state;
  }

  const swimlaneId: number = (<NewTask> task).swimlaneId || (<Task> task).swimlane_id || 0;
  const stageId: number = (<NewTask> task).stageId || (<Task> task).stage_id;

  const swimlanes = project.swimlanes.map((swimlane) => {
    if (swimlaneId === swimlane.id) {
      const stages = swimlane.stages.map((stage) => {
        if (stageId === stage.id) {
          const noNullIdCards = stage.cards.filter((card) => card.id != null);
          return {
            ...stage,
            cards: addLast ? append(task, noNullIdCards) : prepend(task, noNullIdCards),
          };
        }
        return stage;
      });
      return { ...swimlane, stages };
    }
    return swimlane;
  });

  const newFetchProjectState = updateState(state, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: { ...project, swimlanes },
  });

  return updateState(newFetchProjectState, 'addTask', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const addTaskErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'addTask', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const deleteTaskFromProjectReducer: ProjectReducer = (state, action) =>
  updateState(state, 'deleteTaskFromProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const deleteTaskFromProjectSuccessReducer: ProjectReducer = (state, action) => {
  const taskParams: TaskParams = action.payload;
  const project: ProjectDetails = state.fetchProject.value;

  if (project == null) {
    return state;
  }

  const swimlanes = project.swimlanes.map((swimlane) => {
    if (taskParams.swimlaneId === swimlane.id) {
      return {
        ...swimlane,
        stages: swimlane.stages.map((stage: Stage) => {
          if (stage.id === taskParams.stageId) {
            return {
              ...stage,
              cards: stage.cards.filter((card) => card.id !== taskParams.taskId),
            };
          }
          return stage;
        }),
      };
    }
    return swimlane;
  });

  const newFetchProjectState = updateState(state, 'fetchProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: { ...project, swimlanes },
  });

  return updateState(newFetchProjectState, 'deleteTaskFromProject', <ProjectStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: taskParams,
  });
};

const deleteTaskFromProjectErrorReducer: ProjectReducer = (state, action) =>
  updateState(state, 'deleteTaskFromProject', <ProjectStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const resetSubstatesReducer: ProjectReducer = (state, _) => {
  const substates: Array<keyof ProjectState> = [
    'addStage', 'removeStage', 'updateStageName', 'loadMoreTasks', 'taskDropped',
  ];
  return substates
    .reduce((prevState, attr) => updateState(prevState, attr, initialState[attr]), state);
};

const updateTaskAttachmentsCountReducer: ProjectReducer = (state, action) => {
  const project = path<ProjectDetails>(['fetchProject', 'value'], state);

  if (isNil(project)) {
    return state;
  }

  const params = prop<TaskAttachmentParams>('payload', action);

  const updateType = prop<AttachmentCountActionType>('type', params);

  const whenSwimlaneIdMatchs = mapWhenPropsEq({ 'id': params.swimlaneId });

  const whenStageIdMatches = mapWhenPropsEq({ 'id': params.stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': params.taskId });

  let attachmentsCountUpdater: (count: number) => number;

  if (updateType === 'add') {
    attachmentsCountUpdater = inc;
  } else if (updateType === 'remove') {
    attachmentsCountUpdater = dec;
  } else {
    attachmentsCountUpdater = identity;
  }

  const updateAttachmentsCount = evolve({
    'swimlanes': whenSwimlaneIdMatchs(evolve({
      'stages': whenStageIdMatches(evolve({
        'cards': whenTaskIdMatches(evolve({
          'attachments_count': attachmentsCountUpdater,
        })),
      })),
    })),
  });

  return updateState(state, 'fetchProject', mergeWithBaseItem({
    'value': updateAttachmentsCount(project),
  }));
};

const updateTaskCommentsCountReducer: ProjectReducer = (state, action) => {
  const project = path<ProjectDetails>(['fetchProject', 'value'], state);

  if (isNil(project)) {
    return state;
  }

  const params = prop<TaskCommentParams>('payload', action);

  const updateType = propOr<string, TaskCommentParams, CommentActionType>('', 'type', params);

  const whenSwimlaneIdMatchs = mapWhenPropsEq({ 'id': params.swimlaneId });

  const whenStageIdMatches = mapWhenPropsEq({ 'id': params.stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': params.taskId });

  let commentsCountUpdater;

  if (updateType === 'add') {
    commentsCountUpdater = inc;
  } else if (updateType === 'remove') {
    commentsCountUpdater = dec;
  } else {
    commentsCountUpdater = identity;
  }

  const updateCommentsCount = evolve({
    'swimlanes': whenSwimlaneIdMatchs(evolve({
      'stages': whenStageIdMatches(evolve({
        'cards': whenTaskIdMatches(evolve({
          'comments_count': commentsCountUpdater,
        })),
      })),
    })),
  });

  return updateState(state, 'fetchProject', mergeWithBaseItem({
    'value': updateCommentsCount(project),
  }));
};

const updateTaskTodosCountReducer: ProjectReducer = (state, action) => {
  const params = prop<TodoParams>('payload', action);

  const updateType = propOr<string, TodoParams, TodoActionType>('', 'type', params);

  const todo = propOr<Todo, TodoParams, Todo>({} as Todo, 'todo', params);

  const todos = propOr<Todo[], TodoParams, Todo[]>([], 'todos', params);

  const [ doneCount, notDoneCount ] = map(length, partition<Todo>(prop<boolean>('done'), todos));

  const project = path<ProjectDetails>(['fetchProject', 'value'], state);

  const whenSwimlaneIdMatchs = mapWhenPropsEq({ 'id': params.swimlaneId });

  const whenStageIdMatches = mapWhenPropsEq({ 'id': params.stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': params.taskId });

  let todosCountUpdater = identity;

  let doneTodosCountUpdater = identity;

  if (updateType === 'removeTodoList') {
    todosCountUpdater = flip(subtract)(doneCount + notDoneCount);
    doneTodosCountUpdater = flip(subtract)(doneCount);
  }

  if (updateType === 'add') {
    todosCountUpdater = inc;
  }

  if (updateType === 'remove') {
    todosCountUpdater = dec;
    if (todo.done) {
      doneTodosCountUpdater = dec;
    }
  }

  if (updateType === 'edit') {
    if (params.wasTodoDone && !todo.done) {
      doneTodosCountUpdater = dec;
    }

    if (!params.wasTodoDone && todo.done) {
      doneTodosCountUpdater = inc;
    }
  }

  const updateTodosCount = evolve({
    'swimlanes': whenSwimlaneIdMatchs(evolve({
      'stages': whenStageIdMatches(evolve({
        'cards': whenTaskIdMatches(evolve({
          'todos_count': todosCountUpdater,
          'done_todos': doneTodosCountUpdater,
        })),
      })),
    })),
  });

  return updateState(state, 'fetchProject', mergeWithBaseItem({
    'value': updateTodosCount(project),
  }));
};

const updateTaskStatusReducer: ProjectReducer = (state, action) => {
  const task = prop<Task>('payload', action);

  const attrsToUpdate = ['status_id', 'status_name', 'status_color', 'updated_at'];

  const changeTaskStatus = flip(merge)(pick(attrsToUpdate)(task));

  const project = path<ProjectDetails>(['fetchProject', 'value'], state);

  const whenSwimlaneIdMatchs = mapWhenPropsEq({ 'id': task.swimlane_id });

  const whenStageIdMatches = mapWhenPropsEq({ 'id': task.stage_id });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': task.id });

  const updateStatus = evolve({
    'swimlanes': whenSwimlaneIdMatchs(evolve({
      'stages': whenStageIdMatches(evolve({
        'cards': whenTaskIdMatches(changeTaskStatus),
      })),
    })),
  });

  return updateState(state, 'fetchProject', mergeWithBaseItem({
    'value': updateStatus(project),
  }));
};

const updateTaskDatesReducer: ProjectReducer = (state, action) => {
  const task = prop<Task>('payload', action);

  const attrsToUpdate = ['startdate', 'duedate', 'updated_at'];

  const changeTaskDates = flip(merge)(pick(attrsToUpdate)(task));

  const project = path<ProjectDetails>(['fetchProject', 'value'], state);

  const whenSwimlaneIdMatchs = mapWhenPropsEq({ 'id': task.swimlane_id });

  const whenStageIdMatches = mapWhenPropsEq({ 'id': task.stage_id });

  const whenTaskIdMatches = mapWhenPropsEq(pick(['id'], task));

  const updateDates = evolve({
    'swimlanes': whenSwimlaneIdMatchs(evolve({
      'stages': whenStageIdMatches(evolve({
        'cards': whenTaskIdMatches(changeTaskDates),
      })),
    })),
  });

  return updateState(state, 'fetchProject', mergeWithBaseItem({
    'value': updateDates(project),
  }));
};

const updateTaskUsersReducer: ProjectReducer = (state, action) => {
  const task = prop<Task>('payload', action);

  const attrsToUpdate = ['users'];

  const changeTaskUsers = flip(merge)(pick(attrsToUpdate)(task));

  const project = path<ProjectDetails>(['fetchProject', 'value'], state);

  const whenSwimlaneIdMatches = mapWhenPropsEq({ 'id': task.swimlane_id });

  const whenStageIdMatches = mapWhenPropsEq({ 'id': task.stage_id });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': task.id });

  const updateUsers = evolve({
    'swimlanes': whenSwimlaneIdMatches(evolve({
      'stages': whenStageIdMatches(evolve({
        'cards': whenTaskIdMatches(changeTaskUsers),
      })),
    })),
  });

  return updateState(state, 'fetchProject', mergeWithBaseItem({
    'value': updateUsers(project),
  }));
};

const updateTaskTrackedTimeReducer: ProjectReducer = (state, { payload }) => {
  const operation = path<string>(['operation'], payload);
  const task = path<Task>(['params', 'task'], payload);
  const totalTracked = prop<number>('total_tracked', task);
  const tracked = path<number>(['params', 'tracked'], payload);
  const project = path<ProjectDetails>(['fetchProject', 'value'], state);

  const factor = operation === 'add' ? 1 : -1;
  const operateOnTrackedTime = totalTracked + tracked * factor;

  const updateTrackedTime = assoc('total_tracked', operateOnTrackedTime);

  const whenSwimlaneIdMatches = mapWhenPropsEq({ 'id': task.swimlane_id });

  const whenStageIdMatches = mapWhenPropsEq({ 'id': task.stage_id });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': task.id });

  const updateProject = evolve({
    'swimlanes': whenSwimlaneIdMatches(evolve({
      'stages': whenStageIdMatches(evolve({
        'cards': whenTaskIdMatches(updateTrackedTime),
      })),
    })),
  });

  return updateState(state, 'fetchProject', mergeWithBaseItem({
    'value': updateProject(project),
  }));
};

const updateTaskNameReducer: ProjectReducer = (state, action) => {
  const task = prop<Task>('payload', action);

  const attrsToUpdate = ['name', 'updated_at'];

  const changeTaskName = flip(merge)(pick(attrsToUpdate)(task));

  const project = path<ProjectDetails>(['fetchProject', 'value'], state);

  const whenSwimlaneIdMatchs = mapWhenPropsEq({ 'id': task.swimlane_id });

  const whenStageIdMatches = mapWhenPropsEq({ 'id': task.stage_id });

  const whenTaskIdMatches = mapWhenPropsEq(pick(['id'], task));

  const updateTaskName = evolve({
    'swimlanes': whenSwimlaneIdMatchs(evolve({
      'stages': whenStageIdMatches(evolve({
        'cards': whenTaskIdMatches(changeTaskName),
      })),
    })),
  });

  return updateState(state, 'fetchProject', mergeWithBaseItem({
    'value': updateTaskName(project),
  }));
};

const updateTaskDescriptionReducer: ProjectReducer = (state, action) => {
  const project = path<ProjectDetails>(['fetchProject', 'value'], state);

  if (isNil(project)) {
    return state;
  }

  const task = prop<Task>('payload', action);

  const updatedFields = pick(['description', 'updated_at'], task);

  const updateTaskDescription = flip(merge)(updatedFields);

  const whenSwimlaneIdMatches = mapWhenPropsEq({ 'id': task.swimlane_id });

  const whenStageIdMatches = mapWhenPropsEq({ 'id': task.stage_id });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': task.id });

  const updateProject = evolve({
    'swimlanes': whenSwimlaneIdMatches(evolve({
      'stages': whenStageIdMatches(evolve({
        'cards': whenTaskIdMatches(updateTaskDescription),
      })),
    })),
  });

  return updateState(state, 'fetchProject', mergeWithBaseItem({
    'value': updateProject(project),
  }));
};

const defaultReducer: ProjectReducer = (state, _) => state;

const selectReducer = (actionType: string): ProjectReducer => {
  const actionToReducerMap = {
    [ADD_STAGE]: addStageReducer,
    [ADD_STAGE_SUCCESS]: addStageSuccessReducer,
    [ADD_STAGE_ERROR]: addStageErrorReducer,
    [REMOVE_STAGE]: removeStageReducer,
    [REMOVE_STAGE_SUCCESS]: removeStageSuccessReducer,
    [REMOVE_STAGE_ERROR]: removeStageErrorReducer,
    [UPDATE_STAGE_NAME]: updateStageNameReducer,
    [UPDATE_STAGE_NAME_SUCCESS]: updateStageNameSuccessReducer,
    [UPDATE_STAGE_NAME_ERROR]: updateStageNameErrorReducer,
    [FETCH_PROJECT]: fetchProjectReducer,
    [FETCH_PROJECT_SUCCESS]: fetchProjectSuccessReducer,
    [FETCH_PROJECT_ERROR]: fetchProjectErrorReducer,
    [LOAD_MORE_TASKS]: loadMoreTasksReducer,
    [LOAD_MORE_TASKS_SUCCESS]: loadMoreTasksSuccessReducer,
    [LOAD_MORE_TASKS_ERROR]: loadMoreTasksErrorReducer,
    [FETCH_PROJECTS]: fetchProjectsReducer,
    [FETCH_PROJECTS_SUCCESS]: fetchProjectsSuccessReducer,
    [FETCH_PROJECTS_ERROR]: fetchProjectsErrorReducer,
    [REMOVE_FROM_FETCHED_PROJECTS]: removeFromFetchedProjectsReducer,
    [ARCHIVE_PROJECT]: archiveProjectReducer,
    [ARCHIVE_PROJECT_SUCCESS]: archiveProjectSuccessReducer,
    [ARCHIVE_PROJECT_ERROR]: archiveProjectErrorReducer,
    [DELETE_PROJECT]: deleteProjectReducer,
    [DELETE_PROJECT_SUCCESS]: deleteProjectSuccessReducer,
    [DELETE_PROJECT_ERROR]: deleteProjectErrorReducer,
    [CREATE_PROJECT]: createProjectReducer,
    [CREATE_PROJECT_SUCCESS]: createProjectSuccessReducer,
    [CREATE_PROJECT_ERROR]: createProjectErrorReducer,
    [UPDATE_PROJECT]: updateProjectReducer,
    [UPDATE_PROJECT_SUCCESS]: updateProjectSuccessReducer,
    [UPDATE_PROJECT_ERROR]: updateProjectErrorReducer,
    [UPDATE_PROJECTS_INVITEE]: updateProjectsInviteeReducer,
    [UPDATE_PROJECTS_INVITEE_SUCCESS]: updateProjectsInviteeSuccessReducer,
    [UPDATE_PROJECTS_INVITEE_ERROR]: updateProjectsInviteeErrorReducer,
    [REMOVE_PROJECTS_INVITEE]: removeProjectsInviteeReducer,
    [REMOVE_PROJECTS_INVITEE_SUCCESS]: removeProjectsInviteeSuccessReducer,
    [REMOVE_PROJECTS_INVITEE_ERROR]: removeProjectsInviteeErrorReducer,
    [TASK_DROPPED]: taskDroppedReducer,
    [TASK_DROPPED_SUCCESS]: taskDroppedSuccessReducer,
    [TASK_DROPPED_ERROR]: taskDroppedErrorReducer,
    [ADD_TASK]: addTaskReducer,
    [ADD_TASK_SUCCESS]: addTaskSuccessReducer,
    [ADD_TASK_ERROR]: addTaskErrorReducer,
    [RESET_SUBSTATES]: resetSubstatesReducer,
    [DELETE_TASK_FROM_PROJECT]: deleteTaskFromProjectReducer,
    [DELETE_TASK_FROM_PROJECT_SUCCESS]: deleteTaskFromProjectSuccessReducer,
    [DELETE_TASK_FROM_PROJECT_ERROR]: deleteTaskFromProjectErrorReducer,
    [UPDATE_TASK_ATTACHMENTS_COUNT]: updateTaskAttachmentsCountReducer,
    [UPDATE_TASK_COMMENTS_COUNT]: updateTaskCommentsCountReducer,
    [UPDATE_TASK_TODOS_COUNT]: updateTaskTodosCountReducer,
    [UPDATE_TASK_STATUS]: updateTaskStatusReducer,
    [UPDATE_TASK_DATES]: updateTaskDatesReducer,
    [UPDATE_TASK_USERS]: updateTaskUsersReducer,
    [UPDATE_TASK_NAME]: updateTaskNameReducer,
    [UPDATE_TASK_TRACKED_TIME]: updateTaskTrackedTimeReducer,
    [UPDATE_TASK_DESCRIPTION]: updateTaskDescriptionReducer,
    [DEFAULT]: defaultReducer,
  };
  return actionToReducerMap[actionType] || actionToReducerMap[DEFAULT];
};

export function projectReducer(state = initialState, action) {
  const reducer: ProjectReducer = selectReducer(action.type);
  return reducer(state, action);
}
