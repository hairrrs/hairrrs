import styles from '../styles/LayoutA.module.css'
import SideBar from './sideBar'

export default function LayoutA({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <SideBar />
      <main>{children}</main>
    </div>
  )
}
