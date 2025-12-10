import PropTypes from 'prop-types';
import SearchProvider from './search';

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || ''; // Default to empty if not defined

const Intro = ({ data }) => {
  return (
    <div
      className="intro-section section"
      style={{
        backgroundImage: `url(${PUBLIC_URL + data.backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="intro-content-wrapper w-full hidden md:flex flex-row-reverse justify-around items-center gap-6">
        <div className="intro-content">
          {/* inspire 2026 */}
          <span className="sub-title text-lg weight-300 text-white">
            {data.subTitle}
          </span>
          {/* what we do */}
          <h2 className="title !text-lg weight-300 !text-gray-900">
            {data.title}
          </h2>
          {/* smaller text */}
          <div className="desc text-lg text-white">
            <p>{data.desc}</p>
          </div>
        </div>
        <div className="relative">
          <SearchProvider />
        </div>
      </div>
    </div>
  );
};

Intro.propTypes = {
  data: PropTypes.object,
};

export default Intro;
