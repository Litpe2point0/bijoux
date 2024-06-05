import { CCard, CCardBody, CCardHeader } from "@coreui/react"
import Textarea from "@mui/joy/Textarea/Textarea"

const NoteCard = ({ note, handleChange }) => {
    return (
        <CCard className="bg-secondary note h-100">
            <CCardHeader className="text-left text-dark fw-bold px-1 py-0 note-header bg-danger" >
                Note
            </CCardHeader>
            <CCardBody className="note-body bg-light py-1 px-1 ">
                {/* <CFormTextarea className="px-1 input-focus-bg-light" rows={7} >{quote.note}</CFormTextarea> */}
                <Textarea className="p-2 " minRows={10} maxRows={30} size="lg" style={{height:'100%', fontSize: '14px' }} defaultValue={note} onChange={(e)=>handleChange(e.target.value)}/>
            </CCardBody>
        </CCard>
    )
}
export default NoteCard