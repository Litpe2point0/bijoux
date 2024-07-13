import { CButton, CCard, CCardBody, CCardHeader, CPopover, CSpinner } from "@coreui/react"
import Textarea from "@mui/joy/Textarea/Textarea"
import { Button } from '@mui/material'
import { useEffect, useState } from "react";

const NoteCard = ({ isLoading, title, mainNote, minRows, maxRows, note, handleChange, cardHeight, disabled }) => {
    const [changeNote, setChangeNote] = useState(false);

    const [noteValue, setNoteValue] = useState(note);

    useEffect(() => {

        handleChange(noteValue);
    }, [noteValue]);

    return (
        <CCard className="bg-secondary note " style={cardHeight && { height: `${cardHeight}` }}>
            <CCardHeader className="text-left text-dark fw-bold px-1 py-0 note-header bg-danger" >
                {title ?
                    <div className="d-flex justify-content-between align-items-center">
                        <span>
                            {changeNote ? "Order's Note" : title}
                        </span>

                        <Button
                            size="small"
                            sx={{ fontSize: '8px', fontWeight: 'bold', color: 'black' }}
                            onClick={() => { setChangeNote(!changeNote) }}
                        >
                            {changeNote ? 'view designer note' : 'view/editing order note'}
                        </Button>
                    </div>



                    : 'Note'}
            </CCardHeader>
            <CCardBody className="note-body bg-light py-1 px-1 ">
                {isLoading ?

                    <div className="h-100">
                        <CSpinner color="danger" />
                    </div>

                    :
                    <>
                        {
                        changeNote == false &&
                        <Textarea
                            disabled={disabled ? disabled : false}
                            className="p-2 text-dark"
                            minRows={minRows}
                            maxRows={maxRows}
                            size="lg"
                            style={{ height: '100%', fontSize: '14px' }}
                            //value={note}
                            defaultValue={note}
                            onChange={(e) => setNoteValue(e.target.value)} />
                        }
                        {changeNote == true &&
                        <Textarea
                            readOnly
                            className="p-2 text-dark"
                            minRows={minRows}
                            maxRows={maxRows}
                            size="lg"
                            style={{ height: '100%', fontSize: '14px' }}
                            defaultValue={mainNote} />

                        }
                    </>

                }
            </CCardBody>
        </CCard>
    )
}
export default NoteCard





