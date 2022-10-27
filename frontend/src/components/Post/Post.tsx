import "./Post.scss";
import { CgGenderFemale, CgGenderMale } from "react-icons/cg";
import Card from "react-bootstrap/Card";

export interface IProps {
	title: string;
	animal_type: string;
	photo_path: string[];
	species: string;
	age: number;
	gender: boolean;
	author: string;
	clickDetail?: React.MouseEventHandler<HTMLButtonElement>;
}

const Post = (props: IProps) => {
	// console.log(props);
	return (
		<div className="Post">
			<button className="post-container" onClick={props.clickDetail}>
				<Card style={{ width: "17rem" }}>
					<Card.Img variant="top" src={props.photo_path[0]} />
					<Card.Body>
						<Card.Title>{props.title}</Card.Title>
						<Card.Text>
							동물: {props.animal_type}
							<br />
							품종: {props.species} <br />
							나이: {props.age} <br />
							성별:{" "}
							{props.gender ? (
								<CgGenderFemale />
							) : (
								<CgGenderMale />
							)}{" "}
						</Card.Text>
						<Card.Text id="post-author">
							작성자: {props.author}
						</Card.Text>
					</Card.Body>
				</Card>
				{/* <div className="post-image-container">
					<img
						className="post-image"
						src={props.photo_path}
						alt={props.species}
					/>
				</div>
				<div id="post-animal-type">{props.animal_type}</div>
				<div id="post-species">{props.species}</div>
				<div id="post-age">{props.age}</div>
				<div id="post-gender">
					{props.gender ? <CgGenderFemale /> : <CgGenderMale />}
				</div>
				<div className="author">{props.author}</div> */}
			</button>
		</div>
	);
};
export default Post;
