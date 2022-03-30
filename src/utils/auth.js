class Auth {
	constructor(adress) {
		this._adress = adress;
	}

	_handleResponse = (response) => {
		if (response.ok) {
			return response.json();
		}
		return Promise.reject(`Ошибка ${response.status}`);
	};

	registration({ email, password }) {
		return fetch(`${this._adress}/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email,
				password
			}),
		})
			.then(this._handleResponse);
	}

	authorization({ email, password }) {
		return fetch(`${this._adress}/signin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email,
				password
			}),
		})
			.then(this._handleResponse);
	}

	getUser(jwt) {
		return fetch(`${this._adress}/users/me`, {
			method: "GET",
			headers: {
				authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json"
			},
		})
			.then(this._handleResponse);
	}
}

const auth = new Auth('https://auth.nomoreparties.co');

export default auth;