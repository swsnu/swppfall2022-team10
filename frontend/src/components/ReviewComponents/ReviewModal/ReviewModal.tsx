import { PropsWithChildren } from "react";
import './ReviewModal.scss'

interface ModalDefaultType {
    onClickToggleModal: () => void;
}

function Modal({
    onClickToggleModal,
    children,
}: PropsWithChildren<ModalDefaultType>) {

    function closeModal() {
        onClickToggleModal();
    }

    return (
        <div className= "Modal">
            <div className="modalBody" onClick={(e) => e.stopPropagation()}>
                <button id="modalCloseBtn" onClick={closeModal}>
                ✖
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;