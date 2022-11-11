import { render, screen } from "@testing-library/react";
import Review from "./Review";
describe("<Review />", () => {
    it("should render without errors", () => {
        render(
            <Review
                title={"REVIEW_TITLE"}
                author={"REVIEW_AUTHOR"}
                photo_path={[]}
                clickDetail={undefined}
            />
        );
        screen.getByText("REVIEW_TITLE");
        screen.getByText("REVIEW_AUTHOR");
    });
});