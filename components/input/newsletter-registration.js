import { useRef, useContext } from 'react';
import classes from './newsletter-registration.module.css';
import NotificationContext from '../../store/notification-context';

function NewsletterRegistration() {
  const emailInputRef = useRef();
  const notificationCtx = useContext(NotificationContext);
  const { showNotification } = notificationCtx;

  function registrationHandler(event) {
    event.preventDefault();
    const email = emailInputRef.current.value;

    showNotification({
      title: 'Adding email',
      message: 'Adding email to database',
      status: 'pending',
    });

    fetch('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: email }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((data) => {
          throw new Error(data.message || 'something went wrong');
        });
      })
      .then((data) => {
        showNotification({
          title: 'Successfully added',
          message: 'You have successfully subscribed',
          status: 'success',
        });
      })
      .catch((err) => {
        showNotification({
          title: 'Failed to subscribe',
          message: err.message || 'something went wrong',
          status: 'error',
        });
      });

    emailInputRef.current.value = '';
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            ref={emailInputRef}
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
