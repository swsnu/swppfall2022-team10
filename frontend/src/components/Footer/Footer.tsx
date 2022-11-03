import { MdPhone, MdOutlineEmail, MdHomeFilled } from 'react-icons/md'
import {
	MDBFooter,
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBIcon
} from 'mdb-react-ui-kit'

import './Footer.scss'

export interface IProps {
	userId: number
}

export default function Footer() {
	return (
		<MDBFooter
			bgColor='light'
			className='text-center text-lg-start text-muted'
		>
			<section className='footer'>
				<MDBContainer className='text-center text-md-start mt-5'>
					<MDBRow className='mt-3'>
						<MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
							<h4 className='text-uppercase fw-bold mb-4'>
								<MDBIcon icon='gem' className='me-3' />
								Be A Family
							</h4>
						</MDBCol>

						<MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
							<h6 className='text-uppercase fw-bold mb-4'>
								Products
							</h6>
							<p>
								<a href='#!' className='text-reset'>
									이용약관
								</a>
							</p>
							<p>
								<a href='#!' className='text-reset'>
									개인정보처리방침
								</a>
							</p>
						</MDBCol>

						<MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
							<h6 className='text-uppercase fw-bold mb-4'>
								Useful links
							</h6>
							<p>
								<a href='#!' className='text-reset'>
									About Us
								</a>
							</p>
							<p>
								<a href='#!' className='text-reset'>
									Help
								</a>
							</p>
						</MDBCol>

						<MDBCol
							md='4'
							lg='3'
							xl='3'
							className='mx-auto mb-md-0 mb-4'
						>
							<h6 className='text-uppercase fw-bold mb-4'>
								Contact
							</h6>
							<p>
								<MdHomeFilled />
								&nbsp; Seoul, South Korea
							</p>
							<p>
								<MdOutlineEmail />
								&nbsp; beAfamily@gmail.com
							</p>
							<p>
								<MdPhone />
								&nbsp; 010-0000-0000
							</p>
						</MDBCol>
					</MDBRow>
				</MDBContainer>
			</section>
		</MDBFooter>
	)
}
