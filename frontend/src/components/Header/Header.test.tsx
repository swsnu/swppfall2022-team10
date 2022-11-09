import { render, screen } from "@testing-library/react";
import Header from "./Header";
describe("<Header />", () => {
	it("should render without errors", () => {
		render(
			<Header 
                userId={1}
            />
		);
		screen.getByText("Be A");
		screen.getByText("Family");
		screen.getByText("입양 절차 소개");
		screen.getByText("입양 게시글");
		screen.getByText("입양 후기");
        screen.getByText("Q&A");
	});
});