import { createAction } from 'redux-actions';
/*
 * action types
 */

export const INIT_SESSION = 'INIT_SESSION';
export const INIT_DOC = 'INIT_DOC';
export const CREATE_REVISION = 'CREATE_REVISION';
export const CLOSE_DOC = 'CLOSE_DOC';
export const CLOSE_SESSION = 'CLOSE_SESSION';

/*
 * other constants
 */

export const docTypes = {
  AWESOME_RESUME: 'AWESOME_RESUME',
  AWESOME_COVER_LETTER: 'AWESOME_COVER_LETTER',
};

/*
 * action creators
 */

export const initSession = createAction(INIT_SESSION);
export const initDoc = createAction(INIT_DOC);
export const createRevision = createAction(CREATE_REVISION);
export const closeDoc = createAction(CLOSE_DOC);
export const closeSession = createAction(CLOSE_SESSION);
