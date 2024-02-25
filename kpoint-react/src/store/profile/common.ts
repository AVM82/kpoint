enum ActionType {
  GET_MY_PROJECTS = 'username/myProjects',
  GET_RECOMMENDED_PROJECTS= 'username/recommendedProjects',
  GET_FAVORITE_PROJECTS = 'username/favoriteProjects',
  UPDATE_PROFILE = 'profile/update',
  CHANGE_PASSWORD = 'profile/changePassword',
  EXISTS_EMAIL = 'username/existsEmail',
  EXISTS_USERNAME = 'username/existsUsername',
}

export { ActionType };
