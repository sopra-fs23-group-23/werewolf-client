import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import StorageManager from 'helpers/StorageManager';

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
export const HomeGuard = (props) => {
  if (StorageManager.getUserToken()) {
    return props.children;
  }
  return <Redirect to="/login" />;
};

HomeGuard.propTypes = {
  children: PropTypes.node,
};
