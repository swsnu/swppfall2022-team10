/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { PropsWithChildren } from 'react'
import './ReviewModal.scss'
import Modal from 'react-bootstrap/Modal'

interface ModalDefaultType {
	onClickToggleModal: () => void
}

export default function ReviewModal({
	onClickToggleModal,
	children
}: PropsWithChildren<ModalDefaultType>) {
	function closeModal() {
		onClickToggleModal()
	}

	return (
		<Modal show={true} onHide={closeModal}>
			<Modal.Header closeButton></Modal.Header>
			<Modal.Body>{children}</Modal.Body>
		</Modal>
	)
}
