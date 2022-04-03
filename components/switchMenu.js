import Link from "next/link";
import { useRouter } from "next/router";

export default function SwitchMenu({ user, setShowMenu, setShowSwitchAccount }) {
  const router = useRouter();

  return (
    <div className="flex-column" style={{ gap: '.7rem', padding: '10px 15px', background: '#f2f2f2', position: 'absolute', right: 0, top: 30, width: 180 }}>
      {user ? <>
        <div onClick={() => { setShowSwitchAccount(true); setShowMenu(false) }}>Switch account</div>
        <div><Link href="/signout"><a onClick={(e) => { e.preventDefault(); logout; setShowMenu(false) }}>Logout</a></Link></div>
      </> :
        <Link href="/?authModal=true" as={`${router.pathname}?signin`}><a onClick={() => { setShowMenu(false) }}>login / signup</a></Link>}
    </div>
  )
}
