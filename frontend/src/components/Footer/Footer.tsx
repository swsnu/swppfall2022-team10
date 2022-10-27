import React from "react";
import { useNavigate } from "react-router-dom";
import { MdPhone, MdOutlineEmail } from "react-icons/md";
import {
	MDBFooter,
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBIcon,
} from "mdb-react-ui-kit";

import "./Footer.scss";

export interface IProps {
	userId: number;
}

export default function Footer(props: IProps) {
	const navigate = useNavigate();

	return (
		<MDBFooter
			bgColor="light"
			className="text-center text-lg-start text-muted"
		>
			<section className="footer">
				<MDBContainer className="text-center text-md-start mt-5">
					<MDBRow className="mt-3">
						<MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
							<h4 className="text-uppercase fw-bold mb-4">
								<MDBIcon icon="gem" className="me-3" />
								Be A Family
							</h4>
						</MDBCol>

						<MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
							<h6 className="text-uppercase fw-bold mb-4">
								Products
							</h6>
							<p>
								<a href="#!" className="text-reset">
									이용약관
								</a>
							</p>
							<p>
								<a href="#!" className="text-reset">
									개인정보처리방침
								</a>
							</p>
						</MDBCol>

						<MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
							<h6 className="text-uppercase fw-bold mb-4">
								Useful links
							</h6>
							<p>
								<a href="#!" className="text-reset">
									About Us
								</a>
							</p>
							<p>
								<a href="#!" className="text-reset">
									Help
								</a>
							</p>
						</MDBCol>

						<MDBCol
							md="4"
							lg="3"
							xl="3"
							className="mx-auto mb-md-0 mb-4"
						>
							<h6 className="text-uppercase fw-bold mb-4">
								Contact
							</h6>
							<p>
								<MDBIcon icon="home" className="me-2" />
								Seoul, South Korea
							</p>
							<p>
								<MDBIcon icon="envelope" className="me-3" />
								beAfamily@gmail.com
							</p>
							<p>
								<MDBIcon icon="phone" className="me-3" /> + 01
								010-0000-0000
							</p>
						</MDBCol>
					</MDBRow>
				</MDBContainer>
			</section>
		</MDBFooter>
		// {/* <div className="Footer">
		// 	<div>
		// 		<button
		// 			id="terms-of-service-button"
		// 			onClick={(event) => {
		// 				event.preventDefault();
		// 			}}
		// 		>
		// 			이용약관
		// 		</button>
		// 		<button
		// 			id="terms-of-privacy-button"
		// 			onClick={(event) => {
		// 				event.preventDefault();
		// 			}}
		// 		>
		// 			개인정보처리방침
		// 		</button>
		// 		<button
		// 			id="about-us-button"
		// 			onClick={(event) => {
		// 				event.preventDefault();
		// 			}}
		// 		>
		// 			About Us
		// 		</button>
		// 	</div>
		// 	<div>
		// 		<button
		// 			id="contact-us-button"
		// 			onClick={(event) => {
		// 				event.preventDefault();
		// 			}}
		// 		>
		// 			<MdPhone />
		// 			010-0000-0000
		// 		</button>
		// 		<button
		// 			id="email-us-button"
		// 			onClick={(event) => {
		// 				event.preventDefault();
		// 			}}
		// 		>
		// 			<MdOutlineEmail />
		// 			BeAFamily@gmail.com
		// 		</button>
		// 	</div>
		// </div> */}
	);
}
