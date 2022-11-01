import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
	getUsers,
	loginUser,
	selectUser,
	UserType,
} from "../../store/slices/user";
// import { Navigate } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import "./Login.scss";

export default function LogIn() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const userState = useSelector(selectUser);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getUsers());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const logInHandler = async () => {
		const verifiedUser = userState.users.find((user: UserType) => {
			return user.email === email && user.password === password;
		});

		if (verifiedUser) {
			await dispatch(loginUser(verifiedUser.id));
			navigate("/");
		} else {
			alert("Email or password is wrong");
			setEmail("");
			setPassword("");
		}
	};
	if (userState.currentUser) {
		return <Navigate to="/posts" />;
	} else {
		return (
			<div className="Login">
				<div className="login-header">
					<h1>Welcome!</h1>
				</div>
				<form className="login-form">
					<div className="login-input">
						<input
							id="email-input"
							type="text"
							placeholder="Enter Email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>
						<input
							id="pw-input"
							type="password"
							placeholder="Enter Password"
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
						/>
					</div>
					<button
						id="login-button"
						onClick={(e) => {
							e.preventDefault();
							logInHandler();
						}}
					>
						Login
					</button>
				</form>
			</div>
		);
	}
}
