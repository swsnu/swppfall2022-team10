/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { PropsWithChildren } from 'react'
import './ImageModal.scss'
import Modal from 'react-bootstrap/Modal'

interface ModalDefaultType {
	onClickToggleModal: () => void
}

export default function ImageModal({
	onClickToggleModal,
	children
}: PropsWithChildren<ModalDefaultType>) {
	function closeModal() {
		onClickToggleModal()
	}

	return (
		<Modal show={true} onHide={closeModal} contentClassName='image'>
			<Modal.Header closeButton></Modal.Header>
			<Modal.Body>{children}</Modal.Body>
		</Modal>
	)
}