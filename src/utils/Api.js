class Api {
	constructor({ address, token }) {
		this._address = address;
		this._token = token;
	}

	_getResponse(res) {
		if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

	getInitialCards() {
		return fetch(`${this._address}/cards`, {
			credentials: "include",
			headers: {
				authorization: this._token,
			}
		})
		.then(this._getResponse);
	}

	createCard({ name, link }) {
		return fetch(`${this._address}/cards`, {
			method: 'POST',
			credentials: "include",
			headers: {
				authorization: this._token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: name,
				link: link
			})
		})
		.then(this._getResponse)
	}

	handleLike(id) {
		return fetch(`${this._address}/cards/likes/${id}`, {
		  method: 'PUT',
		  credentials: "include",
		  headers: {
		  	authorization: this._token,
		}
	  })		
	  .then(this._getResponse)
	}

	removeLikeCard(id) {
		return fetch(`${this._address}/cards/likes/${id}`, {
		  method: 'DELETE',
		  credentials: "include",
		  headers: {
			authorization: this._token,
		}
	  })
	  .then(this._getResponse)
	}

	changeLikeCardStatus(id, isLiked) {
		if(isLiked) {
			return this.handleLike(id);
		}
		else {
			return this.removeLikeCard(id);
		}
	}

	handleDelete(id) {
		return fetch(`${this._address}/cards/${id}`, {
		  method: 'DELETE',
		  credentials: "include",
		  headers: {
			  authorization: this._token,
		}
		})		
		.then(this._getResponse)
	}

	getUserInfo() {
		return fetch(`${this._address}/users/me`, {
			credentials: "include",
			headers: {
				authorization: this._token,
			}
		})
		.then(this._getResponse)
	}

	editUserInfo({ name, about }) {
		return fetch(`${this._address}/users/me`, {
			method: 'PATCH',
			credentials: "include",
			headers: {
				authorization: this._token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				about
			})
		})
		.then(this._getResponse)
	}

	editUserAvatar(avatar) {
		return fetch(`${this._address}/users/me/avatar`, {
		  method: 'PATCH',
		  credentials: "include",
		  headers: {
			  authorization: this._token,
			  'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			avatar: avatar,
		  })
		})
		.then(this._getResponse)
	  }
}

const api = new Api({
	address: 'https://api.domainname.glinkin.nomoreparties.sbs',
	// token: '8f16ac3a-0753-4a70-b9e1-5f31aba6605c',
  });

export default api;