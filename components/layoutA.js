import styles from '../styles/LayoutA.module.css'
import SideBar from './sideBar'

export default function LayoutA({ children }) {
  return (<>
    <div className={styles.layoutContainer}>
      <SideBar />
      <main>{children}</main>
    </div>
    <footer className="m-10 text-center">copywrite @2022 <span className="text-[#eb004e]">Hairrs.com</span></footer>
  </>)
}
