import styles from '../styles/LayoutA.module.css'
import SideBar from './sideBar'

export default function LayoutA({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <div className=""><SideBar /></div>
      <main className="" style={{ maxHeight: '72vh', width: '100vw', overflowY: 'auto', paddingBottom: '20px' }}>{children}</main>
    </div>
  )
}
