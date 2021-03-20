import { useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { CameraContext } from '../context/CameraContext'


import Button from "./Buttons/Button.jsx";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ExtraCompsBar = () => {

const { stateCallAccepted, stateEndingCall } = useContext(CameraContext)

const [callAccepted, setCallAccepted] = stateCallAccepted

const [endingCall, setEndingCall] = stateEndingCall

const [copyText, setCopyText] = useState('Copy');

const [hangUp, setHangUp] = useState(false)

const location = useLocation()


	///states: closeRoom confirmation, LeaveRoom COnfirmation, accepStageInvite, AwaitAnswer
	
  return (
		<div key={callAccepted} className="extra-comps-bar">
  	
			<CopyToClipboard 
				text={window.location.href} 
				style={{ marginBottom: '2rem' }}
				// onClick={setCopyText('Copied')}
			>
				<Button confirm>
					{copyText}
				</Button>
			</CopyToClipboard>
		
		
			{ callAccepted && !hangUp ?
				<Button
					reject
					onClick={()=>{
						setHangUp(true)		
						setCallAccepted(false)
						}
					}
				>HangUp
				</Button> :

				<Button
					reject
					onClick={()=> {
						setHangUp(false)
						setEndingCall(true)
						}
					}
					>Close Room
				</Button> }
  	</div>
  )

};

export default ExtraCompsBar;