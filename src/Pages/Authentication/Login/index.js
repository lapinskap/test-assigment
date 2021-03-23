import React, { useContext } from 'react';
import {
  Col,
} from 'reactstrap';
import { useLocation } from 'react-router-dom';
import RbsContext from '../../../utils/RoleBasedSecurity/RbsContext';
import Tiles from '../../../Components/Tiles';

const Login = () => {
  const rbsContext = useContext(RbsContext);
  const location = useLocation();

  const login = async (type) => {
    await rbsContext.login(type);
  };

  const referer = location.state && location.state.referer ? location.state.referer : null;
  return (
    <div className="h-100 bg-white bg-animation">
      <div className="d-flex h-100 justify-content-center align-items-center">
        <Col className="mx-auto app-login-box">
          <div className="app-logo-inverse mx-auto mb-3" />
          <div className="mx-auto card" style={{ maxWidth: '700px' }}>
            <div className="card-body">
              <Tiles
                selected={null}
                onTileClick={(id) => login(id)}
                md="6"
                sm="6"
                config={[
                  {
                    label: 'OMB mock',
                    icon: 'pe-7s-user',
                    id: 'omb',
                  },
                  {
                    label: 'AHR mock',
                    icon: 'pe-7s-user',
                    id: 'ahr',
                  },
                  {
                    label: 'OMB Prawdziwe dane',
                    icon: 'pe-7s-user',
                    id: 'admin',
                  },
                  {
                    label: 'AHR Prawdziwe dane',
                    icon: 'pe-7s-user',
                    id: 'adminahr',
                  },
                ]}
              />
            </div>
            <div className="modal-footer clearfix">
              <div className="float-left">
                <a
                  href={`/signin/oauth/client/login${referer ? `?referer_url=${encodeURIComponent(`/#${referer}`)}` : ''}`}
                  color="link"
                  className="btn-lg btn btn-link"
                >
                  Zaloguj z MyBenefit
                </a>
              </div>
            </div>
          </div>

          <div className="text-center opacity-8 mt-3">
            Copyright &copy; MyBenefit
            {' '}
            {new Date().getFullYear()}
          </div>
        </Col>
      </div>
    </div>
  );
};

export default Login;
