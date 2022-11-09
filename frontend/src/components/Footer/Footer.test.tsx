import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
describe("<Footer />", () => {
	it("should render without errors", () => {
		render(
			<Footer/>
		);
		screen.getByText("Be A Family");
		screen.getByText("Products");
		screen.getByText("이용약관");
		screen.getByText("개인정보처리방침");
	});
});