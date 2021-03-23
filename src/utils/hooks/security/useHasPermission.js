import { useEffect } from 'react';
import RbsContext from '../../RoleBasedSecurity/RbsContext';
import { godPermission } from '../../RoleBasedSecurity/permissions';

const { useState, useContext } = require('react');

const useHasPermission = (aclKey) => {
  const { userInfo } = useContext(RbsContext);
  const [result, setResult] = useState(null);
  useEffect(() => {
    // const permissions = userInfo.getPermissions();
    // setResult(Boolean(permissions.includes(godPermission) || permissions.includes(aclKey)));
    setResult(true);
  }, [userInfo, aclKey]);

  return result;
};

export default useHasPermission;
