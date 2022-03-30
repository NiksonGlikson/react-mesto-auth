import React from 'react';
import logoHeader from '../images/logoheader.svg';
import { Route, Link } from 'react-router-dom';

function Header({ onSignOut }) {
	return (
		<header className="header">
			<img className="header__logo" src={logoHeader} alt="логотип Место" />
			<Route path="sign-up">
				<Link className="register__link" to="/sign-in">Войти</Link>
			</Route>
			<Route path="/sign-in">
				<Link className="register__link" to='/sign-up'>Регистрация</Link>
			</Route>
			<Route exact path="/">
				<Link className="register__link" to='/sign-in' onClick={onSignOut}>Выйти</Link>
			</Route>
		</header>
	);
}

export default Header;
