enum ActionType {
  GET_BY_ID = 'projects/get-by-id',
  GET_ALL_PROJECTS_DEFAULT = 'projects/get-all',
  GET_ALL_PROJECTS_ADD_MORE = 'projects/get-all-add',
  POST_NEW = 'projects/create-new',
  POST_SUB = 'projects/get-by-id/subscribe',
  DEL_SUB = 'projects/projectId/unsubscribe',
  EDIT = 'projects/projectId/settings',
  EDIT_LOGO = 'projects/projectId/logo',
  GET_SUBSCRIBE_STATUS = 'projects/get-by-id/is-subscribe',
}

export { ActionType };
