import PropTypes from 'prop-types';
import { Fragment, useEffect, useState, useRef } from 'react';
import HamburgerMenu from '../../components/hamburger-menu';
import HeaderNav from '@/components/header-nav/header-nav';
import Logo from '../../components/logo/index';
import Signup from '@/components/login-signup/login-signup';
import MainMenu from '@/components/main-menu-main-menu';

const Header = ({ classOption }) => {
  const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || '';
  const [offcanvasShow, setOffcanvasShow] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const [backAtTop, setBackAtTop] = useState(true);

  const onCanvasHandler = () => setOffcanvasShow((prev) => !prev);

  useEffect(() => {
    // Setup header measurements if the header element exists
    const header = document.querySelector('.header-area');
    if (header) {
      setHeaderTop(header.offsetTop);
      setHeaderHeight(header.offsetHeight);
    }

    let position = window.scrollY;
    let timeoutId = null;

    const handleScroll = () => {
      const scrollPos = window.scrollY;

      // Update backAtTop based on scroll position
      setBackAtTop(scrollPos < 200);

      // Toggle sticky header based on scroll direction and position
      if (scrollPos < 200) {
        setShowSticky(false);
      } else if (scrollPos < position) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setShowSticky(true);
        }, 150);
      } else {
        setShowSticky(false);
      }
      position = scrollPos;
      setScroll(scrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [backAtTop]);

  return (
    <Fragment>
      <header
        className={`header-area header-default sticky-header ${classOption} ${
          showSticky ? 'sticky visible' : ''
        } ${backAtTop ? 'top-header' : ''}`}
      >
        <div className="container-fluid">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto lg:hidden">
              <div className="header-action-area">
                <button className="btn-menu" onClick={onCanvasHandler}>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
                <span className="menu-text">Menu</span>
              </div>
            </div>

            <div className="col-auto flex gap-12">
              <div className="header-logo-area">
                <Logo image={`${PUBLIC_URL}/img/log.png`} />
              </div>
              <div className="col-auto hidden lg:flex">
                <HeaderNav />
              </div>
            </div>

            <div className="col-auto hidden sm:flex gap-6 justify-center items-center">
              <Signup />
              <MainMenu />
            </div>
          </div>
        </div>
      </header>
      <HamburgerMenu show={offcanvasShow} onClose={onCanvasHandler} />
    </Fragment>
  );
};

Header.propTypes = {
  classOption: PropTypes.string,
};

Header.defaultProps = {
  classOption: 'header-area header-default sticky-header',
};

export default Header;
