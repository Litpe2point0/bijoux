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
                        {/* <CPopover
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
                        </CPopover> */}
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
                    (
                        !changeNote  ?
                        <Textarea disabled={disabled ? disabled : false} className="p-2 text-dark" minRows={minRows} maxRows={maxRows} size="lg" style={{ height: '100%', fontSize: '14px' }} value={note} onChange={(e) => setNoteValue(e.target.value)} />
                        :
                        <Textarea readOnly className="p-2 text-dark" minRows={minRows} maxRows={maxRows} size="lg" style={{ height: '100%', fontSize: '14px' }} value={mainNote} />

                    )
                }
            </CCardBody>
        </CCard>
    )
}
export default NoteCard




const DesignNoteCard = ({ mainNote, note, minRows, maxRows, handleChange }) => {
    const [changeNote, setChangeNote] = useState(false);
    const [mainNoteValue, setMainNoteValue] = useState(mainNote);


    useEffect(() => {
        handleChange(mainNoteValue);
    }, [mainNoteValue]);


    return (
        <CCard className="bg-secondary note" style={{ height: `100%` }}>
            <CCardHeader className="text-left text-dark fw-bold px-1 py-0 note-header bg-danger">
                <div className="d-flex justify-content-between align-items-center">
                    <span>
                        {changeNote ? "Order's Note" : "Designer's Note"}
                    </span>
                    <Button
                        size="small"
                        sx={{ fontSize: '8px', fontWeight: 'bold', color: 'black' }}
                        onClick={() => { setChangeNote(!changeNote) }}
                    >
                        {changeNote ? 'view designer note' : 'view/editing order note'}
                    </Button>
                </div>
            </CCardHeader>
            <CCardBody className="note-body bg-light py-1 px-1">
                {!changeNote ?

                    <Textarea
                        className="p-2 text-dark"
                        minRows={minRows}
                        maxRows={maxRows}
                        size="lg"
                        style={{ height: '100%', fontSize: '14px' }}
                        value={note}
                        readOnly
                    />
                    :
                    <Textarea
                        className="p-2 text-dark"
                        minRows={minRows}
                        maxRows={maxRows}
                        size="lg"
                        style={{ height: '100%', fontSize: '14px' }}
                        value={mainNoteValue}
                        onChange={(e) => setMainNoteValue(e.target.value)}
                    />


                }
            </CCardBody>
        </CCard>
    );
};
