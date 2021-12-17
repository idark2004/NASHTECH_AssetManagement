import React from 'react'

import { Link } from 'react-router-dom'

import Grid from './Grid'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faFacebook, faLinkedin, faTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons"

const footerAccreditations = [
    {
        display: "Microsoft",
        path: "/about"
    },
    {
        display: "CMMIDEV",
        path: "/about"
    },
    {
        display: "ISO",
        path: "/about"
    },
    {
        display: "ISTQB",
        path: "/about"
    }
]

const footerUsefulLinks = [
    {
        display: "Harvey Nash Group",
        path: "https://www.harveynashgroup.com/"
    },
    {
        display: "Privacy Notice",
        path: "/about"
    },
    {
        display: "Modern Slavery",
        path: "/about"
    },
    {
        display: "Careers",
        path: "/about"
    },
    {
        display: "E-invoice",
        path: "/about"
    },
]

const Footer = () => {
    return (
        <footer className="footer">
        <div className="container">
          <Grid col={3} mdCol={2} smCol={1} gap={10}>
            <div>
              <div className="footer__title">
                Accreditations
              </div>
              <div className="footer__content">
                  {
                    footerAccreditations.map((item, index) => (
                      <p key={index}>
                          <Link to={item.path}>
                              {item.display}
                          </Link>
                      </p>
                    ))
                  }
              </div>
            </div>
            <div>
              <div className="footer__title">
                  Useful links
              </div>
              <div className="footer__content">
                  {
                    footerUsefulLinks.map((item, index) => (
                      <p key={index}>
                          <Link to={item.path}>
                              {item.display}
                          </Link>
                      </p>
                    ))
                  }
              </div>
            </div>
            <div className="footer__about">
                <p>
                    <Link to="/">
                        <img src="https://www.nashtechglobal.com/wp-content/uploads/2020/04/logo.png" className="footer__logo" alt="" />
                    </Link>
                </p>
                <div className="footer__about__brands">
                    <p>
                        <FontAwesomeIcon icon={faFacebook} pull="left" />
                        <FontAwesomeIcon icon={faLinkedin} pull="left" />
                        <FontAwesomeIcon icon={faTwitter} pull="left" />
                        <FontAwesomeIcon icon={faYoutube} pull="left" />
                    </p>
                </div>
                <p>
                © 2020 NashTech
                <br />
                Part of Harvey Nash Group
                </p>
            </div>
          </Grid>
        </div>
      </footer>
    )
}

export default Footer