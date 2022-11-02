import { Fragment, useContext } from 'react';
import MainHeader from './main-header';
import Notification from '../ui/notification';
import NotificationContext from '../../store/notification-context';

function Layout(props) {
  const notificationCtx = useContext(NotificationContext);
  const { notification } = notificationCtx;

  return (
    <Fragment>
      <MainHeader />
      <main>{props.children}</main>
      {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          status={notification.status}
        />
      )}
    </Fragment>
  );
}

export default Layout;
