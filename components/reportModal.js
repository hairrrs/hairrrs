import { useRouter } from "next/router";

export default function ReportModal() {
  const router = useRouter()
  const currentPage = router.pathname
  const itemId = router?.query?.id
  const type = router?.query?.type

  const closeModal = () => {
    router.push(currentPage);
  }
  const handleSubmit = (e) => {
    console.log(e)
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'gray', display: 'grid', placeItems: 'center', zIndex: 1 }}>
      <div style={{ background: 'white', borderRadius: 5 }}>
        <div className="flex justify-between items-center" style={{ padding: '15px 45px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>Report</div>
          <div style={{ cursor: 'pointer', fontSize: '3rem', fontWeight: 400, color: '#eb004e'}} onClick={closeModal}>x</div>
        </div>
        <hr />

        <div className="" style={{ padding: '35px 45px', color: '#808080' }}>
          <p>Pick a problem</p>
          <br />
          {/* <div style={{ height: '20px'}}></div> */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e) }}>
            <div>radio/checkbox</div>
          <br />
            <div><textarea name="tell_us_more" id="tell_us_more" cols="110" rows="10" style={{ resize: 'none', padding: '20px', border: '2px solid #dfdfdf', fontFamily: 'segoe-ui', letterSpacing: '1.6px', color: '#808080', fontSize: '1rem' }} placeholder="Tell us more"></textarea></div>
            <input type="submit" value="Report" style={{ width: '100%', background: '#eb004e', color: 'white', fontSize: '1.1rem', cursor: 'pointer' }} />
          </form>
        </div>
      </div>
    </div>
  )
}
