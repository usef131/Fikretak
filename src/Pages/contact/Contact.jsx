// Contact.jsx
import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, HelpCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import styles from '../../assets/styles/Contact.module.css';
import SecondNavbar from '../../Components/Common/SecondNavbar';
import Footer from '../../Components/Common/Footer';

export default function ContactPage() {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Replace these placeholder strings with your actual EmailJS credentials
    const SERVICE_ID = 'service_xm3961c';
    const TEMPLATE_ID = 'template_kbh31pm';
    const PUBLIC_KEY = 'wXQpddLTneB4neXTU';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
          setSubmitStatus('success');
          formRef.current.reset();
      }, (error) => {
          setSubmitStatus('error');
      })
      .finally(() => {
          setIsSubmitting(false);
      });
  };

  return (
    <div className={styles.container}>
      <SecondNavbar />
      {/* Background Decorative Lines */}
      <div className={styles.bgLines}>
        <div className={styles.line1}></div>
        <div className={styles.line2}></div>
        <div className={styles.line3}></div>
      </div>

    

      {/* --- MAIN CONTENT SECTION --- */}
      <main className={styles.main}>
        
        {/* Big Background Typography Watermark */}
        <div className={styles.watermark}>CONTACT</div>

        {/* LEFT COLUMN: Info */}
        <div className={styles.infoSection}>
          <div>

            <h1 className={styles.heading}>Get in touch</h1>
            <p className={styles.subheading}>
            "Have questions or ready to transform your ideas into a high-growth investment opportunity?"
            </p>
          </div>

          {/* Contact Cards */}
          <div className={styles.cardsList}>
            <a href="mailto:Fikretak011@gmail.com" className={styles.card}>
              <div className={styles.cardLeft}>
                <div className={styles.iconBox}>
                  <Mail size={20} color="#60a5fa" />
                </div>
                <div>
                  <p className={styles.cardTitle}>Email us</p>
                  <p className={styles.cardValue}>Fikretak011@gmail.com</p>
                </div>
              </div>
              <div className={styles.arrowBox}>
                <ArrowUpRight size={16} color="#cbd5e1" />
              </div>
            </a>

            <a href="tel:+201277488479" className={styles.card}>
              <div className={styles.cardLeft}>
                <div className={styles.iconBox}>
                  <Phone size={20} color="#60a5fa" />
                </div>
                <div>
                  <p className={styles.cardTitle}>Call us</p>
                  <p className={styles.cardValue}>+20 127 748 8479</p>
                </div>
              </div>
              <div className={styles.arrowBox}>
                <ArrowUpRight size={16} color="#cbd5e1" />
              </div>
            </a>

            <div className={styles.card}>
              <div className={styles.cardLeft}>
                <div className={styles.iconBox}>
                  <MapPin size={20} color="#60a5fa" />
                </div>
                <div>
                  <p className={styles.cardTitle}>Our location</p>
                  <p className={styles.cardValue}>Cairo, Egypt</p>
                </div>
              </div>
              <div className={styles.arrowBox}>
                <ArrowUpRight size={16} color="#cbd5e1" />
            
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contact Form */}
        <div className={styles.formSection}>
          <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
            <div>
              <input
                type="text"
                name="user_name"
                placeholder="Name"
                className={styles.inputField}
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="user_email"
                placeholder="Email"
                className={styles.inputField}
                required
              />
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Message"
                rows="6"
                className={styles.textareaField}
                required
              ></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </button>

            {/* Form Validation Feedback Alerts */}
            {submitStatus === 'success' && (
              <p className={`${styles.statusMessage} ${styles.success}`}>
                Message sent successfully! We'll get back to you soon.
              </p>
            )}
            {submitStatus === 'error' && (
              <p className={`${styles.statusMessage} ${styles.error}`}>
                Oops! Something went wrong. Please try again later.
              </p>
            )}
          </form>
        </div>
      </main>

     <Footer />
    </div>
  );
}

  

