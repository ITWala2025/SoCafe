'use client';

import React from 'react';

export default function VisitUs() {
  return (
    <section className="visit-section" id="visit">
      <div className="container">
        <div className="visit-grid">
          <div className="visit-content">
            <p className="section-label reveal">FIND US</p>
            <h2 className="section-title reveal reveal-delay-1">
              Come say hello.
            </h2>
            <div className="visit-info-grid reveal reveal-delay-2">
              <div className="visit-info-item">
                <h4>📍 Location</h4>
                <p>
                  Lucan Community Centre<br />
                  Esker Lane, Lucan<br />
                  Co. Dublin, Ireland
                </p>
              </div>
              <div className="visit-info-item">
                <h4>🕐 Opening Hours</h4>
                <p>
                  Monday – Friday<br />
                  8:00 AM – 4:00 PM<br /><br />
                  Saturday – Sunday<br />
                  9:00 AM – 3:00 PM
                </p>
              </div>
              <div className="visit-info-item">
                <h4>📞 Contact</h4>
                <p>
                  <a href="mailto:hello@socoffee.ie" className="contact-link">
                    hello@socoffee.ie
                  </a>
                </p>
              </div>
              <div className="visit-info-item">
                <h4>🌐 Follow Us</h4>
                <p>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    @socoffee.lucan
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="visit-map reveal reveal-delay-1">
            <iframe
              src="https://maps.google.com/maps?q=Lucan+Community+Centre,+Esker+Lane,+Lucan,+Dublin,+Ireland&t=&z=15&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="So Coffee Location Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
