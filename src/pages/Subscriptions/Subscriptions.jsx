import React, { useContext } from 'react';
import { SubscriptionsContext } from '../../libs/Store';
import PodcastGrid from '../../components/PodcastGrid/PodcastGrid';
import strings from '../../libs/language';
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
              {strings.noPodcastsSubscribed}
            </div>
          </div>
        )}
    </div>
  );
}

export default SubscriptionsPage;
