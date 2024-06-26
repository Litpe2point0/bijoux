import { CCard, CCardBody, CCardHeader } from "@coreui/react"
import Textarea from "@mui/joy/Textarea/Textarea"
import { Button } from "@mui/material"
import { useEffect, useState } from "react"


const NormalNoteCard = ({ mainNote, note, handleChange }) => {

    return (
        <CCard className="bg-secondary note h-100">
            <CCardHeader className="text-left text-dark fw-bold px-1 py-0 note-header bg-danger" >
                Note
            </CCardHeader>
            <CCardBody className="note-body bg-light py-1 px-1 ">
                {/* <CFormTextarea className="px-1 input-focus-bg-light" rows={7} >{quote.note}</CFormTextarea> */}
                <Textarea className="p-2 " minRows={10} maxRows={30} size="lg" style={{ height: '100%', fontSize: '14px' }} defaultValue={note} onChange={(e) => handleChange(e.target.value)} />
            </CCardBody>
        </CCard>
    )
}
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
                { !changeNote ?

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



const NoteCard = ({ mainNote, note, minRows, maxRows, handleChange }) => {


    if (mainNote != null) {
        return <DesignNoteCard mainNote={mainNote} minRows={minRows} maxRows={maxRows} note={note} handleChange={handleChange} />

    } else {
        return <NormalNoteCard note={note} handleChange={handleChange} />

    }

}
export default NoteCard