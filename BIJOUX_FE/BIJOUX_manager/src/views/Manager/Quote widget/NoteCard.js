import { CButton, CCard, CCardBody, CCardHeader, CPopover, CSpinner } from "@coreui/react"
import Textarea from "@mui/joy/Textarea/Textarea"
import { Button } from '@mui/material'

const NoteCard = ({ isLoading, title, mainNote, minRows, maxRows, note, handleChange, cardHeight }) => {
    return (
        <CCard className="bg-secondary note " style={cardHeight && { height: `${cardHeight}` }}>
            <CCardHeader className="text-left text-dark fw-bold px-1 py-0 note-header bg-danger" >
                {title ?
                    <div className="d-flex justify-content-between align-items-center">
                        <span>
                            {title}
                        </span>
                        <CPopover
                            style={{
                                maxWidth: '1000px', // Chiều rộng tối đa của popover
                                minWidth: '30vw', // Chiều rộng tối thiểu của popover
                                minHeight: 'fit-content', // Chiều cao tối đa của popover
                                maxHeight: 'fit-content', // Chiều cao tối thiểu của popover
                                padding: '10px' // Khoảng đệm bên trong popover
                            }}
                            title="Order's Note"
                            content={
                                <Textarea className="p-2 h-100 w-100" size="lg" maxRows={20} style={{ fontSize: '16px' }} value={mainNote} />
                            }
                            placement="right"
                            trigger={"click"}
                        >
                            <Button size="small"   sx={{fontSize:'8px', fontWeight:'bold', color:'black'}}>
                                view order note
                            </Button>
                        </CPopover>
                    </div>



                    : 'Note'}
            </CCardHeader>
            <CCardBody className="note-body bg-light py-1 px-1 ">
                {/* <CFormTextarea className="px-1 input-focus-bg-light" rows={7} >{quote.note}</CFormTextarea> */}
                {isLoading ?

                    <div className="h-100">
                        <CSpinner color="danger" />
                    </div>

                    :
                    <Textarea className="p-2 " minRows={minRows} maxRows={maxRows} size="lg" style={{ height: '100%', fontSize: '14px' }} defaultValue={note} onChange={(e) => handleChange(e.target.value)} />
                }
            </CCardBody>
        </CCard>
    )
}
export default NoteCard