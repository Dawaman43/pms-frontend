import styles from "../../pages/TeamLeaderDashboard.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>
          &copy; 2025 Adama Science & Technology University. All rights
          reserved.
        </p>
        <div className={styles.footerLinks}>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
