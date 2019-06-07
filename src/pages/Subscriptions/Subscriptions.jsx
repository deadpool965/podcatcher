import React, { useContext } from 'react';
import { SubscriptionsContext } from '../../libs/Store';
import PodcastGrid from '../../components/PodcastGrid/PodcastGrid';
import './Subscriptions.css';

function SubscriptionsPage() {
  const [subscriptions] = useContext(SubscriptionsContext);
  return (
    <div className="subscriptions-page">
      {subscriptions.length > 0
        ? (
          <PodcastGrid podcasts={subscriptions} />
        )
        : (
          <div className="subscriptions-page__empty">
            <div>
              <i
                className="icon ion-md-sad"
              />
            </div>
            <div>
              No podcasts subscribed
            </div>
          </div>
        )}
    </div>
  );
}

export default SubscriptionsPage;
