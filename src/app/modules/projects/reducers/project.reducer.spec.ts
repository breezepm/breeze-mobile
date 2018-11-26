import { projectReducer, initialState, ProjectStateItem } from './project.reducer';
import {
  ProjectAction,
  fetchProjects, fetchProjectsSuccess, fetchProjectsError,
  createProject, createProjectError, ProjectData,
} from '../actions/project.actions';

describe('[reducer] projectReducer', () => {

  describe('Fetch projects action', () => {

    describe('[micro reducer] fetchProjectsReducer', () => {
      const testDescription = `should set true to "pending" and the action payload to "value" in
        the initialState.fetchProjects object`;

      it(testDescription, () => {
        const action: ProjectAction = fetchProjects(null);
        const currentState = projectReducer(initialState, action);
        const expected: ProjectStateItem = {
          value: action.payload,
          pending: true,
          success: false,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchProjects).toEqual(expected);
      });

    });

    describe('[micro reducer] fetchProjectsSuccessReducer', () => {
      const testDescription = `should set success to "true" and the action payload to "value" in
        the initialState.fetchProjects object`;

      it(testDescription, () => {
        const action: ProjectAction = fetchProjectsSuccess([
          {
            workspace: '',
            workspace_id: 1,
            position: -1,
            projects: [
              {
                description: '',
                id: 2,
                name: '',
                start: false,
              },
            ],
            workspaces: [],
          },
        ]);
        const currentState = projectReducer(initialState, action);
        const expected: ProjectStateItem = {
          value: action.payload,
          pending: false,
          success: true,
          error: false,
          errorData: null,
        };
        expect(currentState.fetchProjects).toEqual(expected);
      });

    });

    describe('[micro reducer] fetchProjectsErrorReducer', () => {
      const testDescription = `should set error to "true" and the action payload to "errorData" in
        the initialState.fetchProjects object`;

      it(testDescription, () => {
        const action: ProjectAction = fetchProjectsError({ status: 401, data: {} });
        const currentState = projectReducer(initialState, action);
        const expected: ProjectStateItem = {
          value: null,
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.fetchProjects).toEqual(expected);
      });

    });

  });

  describe('Create projects action', () => {

    describe('[micro reducer] createProjectReducer', () => {
      const testDescription = `should set true to "pending" and the action payload to "value" in
        the initialState.createProject object`;

      it(testDescription, () => {
        const payload: ProjectData = {
          name: 'foo',
          invitees: ['foo', 'bar'],
          workspace_id: null,
        };
        const action: ProjectAction = createProject(payload);
        const currentState = projectReducer(initialState, action);
        const expected: ProjectStateItem = {
          value: action.payload,
          pending: true,
          success: false,
          error: false,
          errorData: null,
        };
        expect(currentState.createProject).toEqual(expected);
      });

    });

    describe('[micro reducer] createProjectErrorReducer', () => {
      const testDescription = `should set error to "true" and the action payload to "errorData" in
        the initialState.createProject object`;

      it(testDescription, () => {
        const action: ProjectAction = createProjectError({ status: 401, data: {} });
        const currentState = projectReducer(initialState, action);
        const expected: ProjectStateItem = {
          value: null,
          pending: false,
          success: false,
          error: true,
          errorData: action.payload,
        };
        expect(currentState.createProject).toEqual(expected);
      });

    });
  });
});
