class UserInfo {
  constructor({
    id, role, email, companyId, firstName, lastName, permissions = [], username, relations = {},
  }) {
    this.getId = () => id;
    this.getRole = () => role;
    this.getFirstName = () => firstName;
    this.getLastName = () => lastName;
    this.getPermissions = () => permissions;
    this.getRelations = () => relations;
    this.getEmail = () => email;
    this.getUsername = () => username;
    this.getCompanyId = () => companyId;
    this.isAhr = () => role === 'ahr';
    this.hasAccessToPanel = () => ['ahr', 'omb'].includes(role);
  }
}

export default UserInfo;
