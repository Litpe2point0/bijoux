import { useState } from "react";
import ReactFileReader from "react-file-reader";
import { Camera } from "phosphor-react";
import { CButton } from '@coreui/react';
import { Button } from "@mui/material";

export default function RelatedUpload({rowIndex , handleRelatedUpload }) {
    const [urls, setUrls] = useState([]);


    const handleFilesMultiple = (files) => {
        const newUrls = [];
        for (let i = 0; i < files.base64.length; i++) {
            newUrls.push(files.base64[i]);
        }
        handleRelatedUpload(rowIndex, newUrls);
        setUrls([...newUrls]);

    };
    return (
        <div className="rounded-4 p-2 d-flex flex-column align-items-center h-100" style={{ maxHeight: '100%', maxWidth: '100%', position: 'relative' }}>
            <CButton className="rounded-3" disabled={false} color="light" style={{ width: '100%', height: '100%', border: '2px dashed gray', position: 'relative' }}>
                <div className="p-2 rounded-3" style={{ border: '2px dashed gray', width: '100%', height: '100%', position: 'relative' }}>
                    {urls.length != 0 ? (
                        <>
                            <Button variant="outlined" style={{ height: 'fit-content', border: '0.2px dashed gray', position: 'absolute', top: '10px', right: '10px', padding: '0' }}>
                                <ReactFileReader
                                    fileTypes={[".png", ".jpg"]}
                                    base64={true}
                                    multipleFiles={true}

                                    handleFiles={handleFilesMultiple}
                                >
                                    <Camera size={20} weight="duotone" color="gray" />
                                    <span className="text-secondary" style={{ fontSize: '10px' }}>Upload</span>
                                </ReactFileReader>
                            </Button>
                            {/* <img style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} src={url} alt="Avatar Placeholder" /> */}

                            {urls.map((url, index) => (
                                <img key={index} width={'30%'} src={url} alt={`Uploaded ${index}`} />
                            ))
                            }
                        </>
                    ) : (
                        <ReactFileReader
                            fileTypes={[".png", ".jpg"]}
                            base64={true}
                            multipleFiles={true}

                            handleFiles={handleFilesMultiple}
                        >
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                Upload 2 Related Images
                            </div>
                        </ReactFileReader>
                    )}
                </div>
            </CButton>
        </div>
    );
}
