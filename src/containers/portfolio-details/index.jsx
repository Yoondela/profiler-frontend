import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PortfolioDetailsContainer = ({ data }) => {
  const cate = data.servicesOffered.map((value, idx) => {
    return (
      <span className="d-inline" key={idx}>
        {value}
        {idx !== data.servicesOffered.length - 1 && ' , '}
      </span>
    );
  });
  return (
    <div className="portfolio-area portfolio-single">
      <div className="containe">
        <div className="row">
          <div className="col-lg-12">
            <div className="company-profile-header">Header</div>
            <div className="inner-content container">
              <div className="content" data-aos="fade-up">
                <p className="category">{cate}</p>
                <h3 className="title">{data.name}</h3>
              </div>
              <div className="portfolio-info">
                <div className="row">
                  <div
                    className="col-sm-6 col-md-3 col-lg-3"
                    data-aos="fade-up"
                  >
                    <div className="info-item style-two">
                      <span>Services</span>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: data.services,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="col-sm-6 col-md-3 col-lg-3"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="info-item">
                      <span>gender</span>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: data.gender,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="col-sm-6 col-md-3 col-lg-3"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    <div className="info-item">
                      <span>Date joined</span>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: data.dateJoined,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="col-sm-6 col-md-3 col-lg-3"
                    data-aos="fade-up"
                    data-aos-delay="900"
                  >
                    <div className="info-item">
                      <span>call out /mon</span>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: data.callOutsPerMonth,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="portfolio-content" data-aos="fade-up">
                {data.body.map((value, i) => {
                  return (
                    <div
                      key={i}
                      className="content-wrap"
                      dangerouslySetInnerHTML={{
                        __html: value,
                      }}
                    />
                  );
                })}
                <Link to={process.env.PUBLIC_URL + data.pageUrl.link}>
                  {data.pageUrl.text}
                </Link>
              </div>
              <div
                className="thumb section-padding-bottom"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <img
                  className="w-100"
                  src={`${process.env.PUBLIC_URL}/${data.gallery.imageOne}`}
                  alt="exalt"
                />
              </div>
              <div className="row">
                <div
                  className="col-lg-8 m-auto"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="thumb section-padding-bottom">
                    <img
                      className="w-100"
                      src={`${process.env.PUBLIC_URL}/${data.gallery.imageTwo}`}
                      alt="exalt"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12" data-aos="fade-up">
            <div className="thumb section-padding-bottom">
              <img
                className="w-100"
                src={`${process.env.PUBLIC_URL}/${data.gallery.imageThree}`}
                alt="exalt"
              />
            </div>
          </div>
        </div>
        <div className="row thumb style-two">
          <div
            className="col-md-6 col-lg-5 pl-sm-15 pl-0"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <img
              className="mb-xs-30 mb-sm-60"
              src={`${process.env.PUBLIC_URL}/${data.gallery.imageFour}`}
              alt="exalt"
            />
          </div>
          <div
            className="col-md-6 col-lg-7 text-end pr-sm-15 pr-0"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <img
              className="sm-pl-0 pl-md-50"
              src={`${process.env.PUBLIC_URL}/${data.gallery.imageFive}`}
              alt="exalt"
            />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12" data-aos="fade-up">
            <div className="social-icons">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="social_twitter"></i>
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="icofont-facebook"></i>
              </a>
              <a
                href="https://myaccount.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="icofont-google-plus"></i>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="icofont-instagram"></i>
              </a>
            </div>
          </div>
          <div
            className="col-lg-12 text-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <p
              className="available"
              dangerouslySetInnerHTML={{
                __html: `<span class="name">${data.name}</span> is available`,
              }}
            />
            <Link to={process.env.PUBLIC_URL + '/'} className="btn-request">
              <span>Request</span>
              {''}
              {/* <i className="arrow_carrot-right_alt2"></i> */}
            </Link>
          </div>
        </div>
        {/* <div className="row">
                    <div
                        className="col-lg-12"
                        data-aos="fade-up"
                        data-aos-delay="600"
                    >
                        <div className="portfolio-navigation">
                            <div className="prev">
                                <Link to={process.env.PUBLIC_URL + "/"}>
                                    <i className="arrow_carrot-left"></i>{" "}
                                    Previous
                                </Link>
                            </div>
                            <div className="next">
                                <Link to={process.env.PUBLIC_URL + "/"}>
                                    Next <i className="arrow_carrot-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div> */}
      </div>
    </div>
  );
};

PortfolioDetailsContainer.propTypes = {
  data: PropTypes.object,
};

export default PortfolioDetailsContainer;
