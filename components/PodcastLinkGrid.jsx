import Link from 'next/link';

function PodcastLinkGrid({ podcasts }) {
  return (
    <div className="grid">
      {
        podcasts
          .map(({
            id,
            name,
            artworkUrl100,
          }) => (
            <Link
              key={id}
              href={`/${id}`}
            >
              <a>
                <img
                  src={artworkUrl100}
                  alt={name}
                />
                <span className="hidden-text">{name}</span>
              </a>
            </Link>
          ))
      }
      <style jsx>
        {`
          .grid {
            display: grid;
            grid-gap: 16px;
            grid-template-columns: repeat(2, auto);
          }

          @media (min-width: 400px) {
            .grid {
              grid-template-columns: repeat(3, auto);
            }
          }

          @media (min-width: 600px) {
            .grid {
              grid-template-columns: repeat(5, auto);
            }
          }

          a {
            display: block;
            padding-top: 100%;
            position: relative;
            background-color: var(--accent-bg-color);
            border-radius: 8px;
            box-shadow: 0px 3px 4px rgba(0, 0, 0, .3);
          }

          a:hover {
            opacity: .7;
          }

          img {
            display: block;
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }

          .hidden-text {
            display: block;
            width: 1px;
            height: 1px;
            overflow: hidden;
            opacity: 0;
            top: 0px;
            left: 0px;
          }
        `}
      </style>
    </div>
  );
}

export default PodcastLinkGrid;
