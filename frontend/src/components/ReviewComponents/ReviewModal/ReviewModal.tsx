/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { PropsWithChildren, useEffect } from "react";
import './ReviewModal.scss'

interface ModalDefaultType {
    onClickToggleModal: () => void;
}

function Modal({
    onClickToggleModal,
    children,
}: PropsWithChildren<ModalDefaultType>) {
    useEffect(() => {
        document.body.style.cssText = `
        position: fixed;
        top: -${window.scrollY}px;
        overflow-y: scroll;
        width: 100%;`;
        return () => {
            const scrollY = document.body.style.top;
            document.body.style.cssText = '';
            window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        };
    }, []);

    function closeModal() {
        onClickToggleModal();
    }

    return (
        <div className= "Modal">
            <div className="modalBody" onClick={(e) => e.stopPropagation()}>
                <button id="modalCloseBtn" onClick={closeModal}>
                ✖
                </button>
                <div id = "modalContent">{children}</div>
            </div>
        </div>
    );
}

export default Modal;