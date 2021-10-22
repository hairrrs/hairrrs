import React from 'react'

function AlertModal({ alertModal, setAlertModal, alertMsg }) {
    return (
        <div className={`authModal signinalert modal_show_${alertModal}`}>
            <div className="container">
                {/* <div onClick={() => { setAlertModal(false) }} style={{ cursor: 'pointer' }} className="close">&times;</div> */}
                <div className="logins">
                    <div className="info-1">
                        <p style={{ color: 'red' }}>{alertMsg}</p>
                        <p className="btn underline" onClick={() => { setAlertModal(false) }} style={{ cursor: 'pointer' }}>Try again?</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AlertModal
