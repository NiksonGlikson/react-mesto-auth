class Api {
	constructor({ adress, token }) {
		this._adress = adress;
		this._token = token;
	}

	_getResponse(res) {
		if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

	getInitialCards() {
		return fetch(`${this._adress}/cards`, {
			headers: {
				authorization: this._token,
			}
		})
		.then(this._getResponse);
	}

	createCard({ name, link }) {
		return fetch(`${this._adress}/cards`, {
			method: 'POST',
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
		return fetch(`${this._adress}/cards/likes/${id}`, {
		  method: 'PUT',
		  headers: {
		  	authorization: this._token,
		}
	  })		
	  .then(this._getResponse)
	}

	removeLikeCard(id) {
		return fetch(`${this._adress}/cards/likes/${id}`, {
		  method: 'DELETE',
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
		return fetch(`${this._adress}/cards/${id}`, {
		  method: 'DELETE',
		  headers: {
			  authorization: this._token,
		}
		})		
		.then(this._getResponse)
	}

	getUserInfo() {
		return fetch(`${this._adress}/users/me`, {
			headers: {
				authorization: this._token,
			}
		})
		.then(this._getResponse)
	}

	editUserInfo({ name, about }) {
		return fetch(`${this._adress}/users/me`, {
			method: 'PATCH',
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
		return fetch(`${this._adress}/users/me/avatar`, {
		  method: 'PATCH',
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
	adress: 'https://mesto.nomoreparties.co/v1/cohort-35/',
	token: '8f16ac3a-0753-4a70-b9e1-5f31aba6605c',
  });

export default api;
