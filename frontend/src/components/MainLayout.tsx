import { Outlet } from 'react-router-dom';
import Header from './Header';
import styles from './MainLayout.module.css';

function MainLayout() {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.contentArea}>
        {/* Child routes will be rendered here */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout; 