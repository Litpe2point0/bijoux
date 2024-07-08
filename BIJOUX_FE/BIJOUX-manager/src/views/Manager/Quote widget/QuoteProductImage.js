import { useEffect, useState } from "react";
import ReactFileReader from "react-file-reader";
import { Camera } from "phosphor-react";
import { CButton } from '@coreui/react';
import { Button } from "@mui/material";

export default function QuoteProductImage({ defaultImage, disabled }) {
   // alert(defaultImage)
    const [url, setUrl] = useState('');
    useEffect(() => {
        setUrl(defaultImage)
    }, [defaultImage])

    return (
        <div className="rounded-4 p-2 d-flex flex-column align-items-center h-100" style={{ maxHeight: '100%', maxWidth: '100%' }}>
            <CButton className="rounded-3" disabled={false} color="light" style={{ width: '100%', height: '100%', border: '2px dashed gray' }}>
                <div className="p-2 rounded-3" style={{ border: '2px dashed gray', width: '100%', height: '100%' }}>
                    <img style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} src={url} alt="Avatar Placeholder" />
                </div>
            </CButton>
        </div>
    );
}
