import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <svg
        className={styles.loadingLogo}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 283.5 283.5"
      >
        <path
          d="M0 0v283.5h283.5V0H0Zm221.55 108.55h-16v-40h16v40Z"
          style={{
            strokeWidth: 0,
          }}
        />
      </svg>
    </div>
  );
};
