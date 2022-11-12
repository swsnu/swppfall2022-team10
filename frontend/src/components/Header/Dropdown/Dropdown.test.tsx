import { render, screen } from "@testing-library/react";
import Dropdown from "./Dropdown";


describe("<Dropdown />", () => {
    it("should render without errors", () => {
        render(
            <Dropdown
                userId={1}
                visibility={false}
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