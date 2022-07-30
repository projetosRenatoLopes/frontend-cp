import React from "react";
import './index.css'
const Modal = (arrItens) => {

    const titleModal = arrItens.titleModal;
    const bodyModal = arrItens.bodyModal;
    const bottomModal = arrItens.bottomModal;
    
    return (
        <>
            <div className="back-modal"></div>
            <div className="modal">
                <div className="top-modal">
                    {titleModal}
                </div>
                <div className="body-modal">
                    {bodyModal}
                </div>
                <div className="botom-modal">
                    {bottomModal}
                </div>
            </div>
        </>
    )

}

export default Modal;