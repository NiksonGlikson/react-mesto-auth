import React from "react";
import "../index.css";
import Header from "../components/Header.js";
import Main from "../components/Main.js";
import ImagePopup from "../components/ImagePopup.js";
import EditProfilePopup from "../components/EditProfilePopup.js";
import EditAvatarPopup from "../components/EditAvatarPopup.js";
import AddPlacePopup from "../components/AddPlacePopup.js";
import DeleteCardPopup from "../components/DeleteCardPopup.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import api from "../utils/Api.js";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Login from "../components/Login.js";
import Register from "../components/Register.js";
import InfoTooltip from "../components/InfoTooltip.js";
import ProtectedRoute from "../components/ProtectedRoute.js";
import successfulRegistr from "../images/good.svg";
import unSuccessfulRegistr from "../images/bad.svg";
import auth from "../utils/auth.js";


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [isToolTipPopupOpen, setIsToolTipPopupOpen] = React.useState(false);
  const [toolTipMessage, setToolTipMessage] = React.useState({});
  const [selectedCard, setSelectedCard] = React.useState({ name: "", link: "" });
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [cardDelete, setCardDelete] = React.useState();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const propsMain = {
	onEditAvatar: handleEditAvatarClick,
	onEditProfile: handleEditProfileClick,
	onAddPlace: handleAddPlaceClick,
	onCardDelete: handleDeletePopupClick,
	onCardClick: handleCardClick,
	onCardLike: handleCardLike,
	cards: cards
  }

  const history = useHistory();

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleDeletePopupClick(cardInfo) {
    setIsDeletePopupOpen(true);
    setCardDelete(cardInfo);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeletePopupOpen(false);
    setIsToolTipPopupOpen(false);
    setSelectedCard({ 
		name: "", 
		link: "" 
	});
  }

  function handleCardClick(cardInfo) {
    setSelectedCard({ 
		name: cardInfo.name, 
		link: cardInfo.link 
	});
  }

  function handleUpdateUser(currentUser) {
    api
      .editUserInfo({ 
		  name: currentUser.name, 
		  about: currentUser.about 
		})
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .editUserAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleAddPlaceSubmit({ 
	  name, 
	  link 
	}) {
    api
      .createCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id 
            ? newCard 
            : c
            ))
        );
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleCardDelete(card) {
    api
      .handleDelete(card._id)
      .then(() => {
        const deleteCards = cards.filter((c) => c._id !== card._id);
        setCards(deleteCards);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleSubmitRegistr(data) {
    auth.registration(data)
      .then(({ email }) => {
        setCurrentUser({ ...currentUser, email })
        history.push("/sign-in")
        setIsToolTipPopupOpen(true)
        setToolTipMessage({ message: 'Вы успешно зарегистрировались!', img: successfulRegistr })
    })
      .catch((err) => {
        console.log(err);
        setIsToolTipPopupOpen(true);
        setToolTipMessage({ message: 'Что-то пошло не так! Попробуйте ещё раз.', img: unSuccessfulRegistr })
    })
  }

  function handleSubmitAuth(data) {
    auth.authorization(data)
      .then(({ token }) => {
        localStorage.setItem('jwt', token)
        setIsLoggedIn(true)
        history.push('/')
    })
      .catch((err) => {
        console.log(err);
        setIsToolTipPopupOpen(true);
        setToolTipMessage({ message: 'Что-то пошло не так! Попробуйте ещё раз.', img: unSuccessfulRegistr })
    })
  }

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if(jwt) {
      setIsLoggedIn(true)
      auth.getUser(jwt)
        .then(({ data: { email } }) => {
          setCurrentUser({ ...currentUser, email })
      })
        .catch((err) => {
          console.log(err)
      })
    }
  }

  function signOut() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    history.push('/sign-in');

  }

  React.useEffect(() => {
    tokenCheck();
      if(isLoggedIn)
        Promise.all([api.getInitialCards(), api.getUserInfo()])

          .then(([cards, res]) => {
            setCurrentUser({ ...currentUser, ...res });
            setCards(cards);
      })
          .catch((err) => `Не удалось получить карточки с сервера : ${err}`);
  }, [isLoggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header 
            onSignOut={signOut} 
          />
          <Switch>
          <ProtectedRoute exact path="/" component={Main} propsMain={propsMain} />
          <Route path='/sign-in'>
            {isLoggedIn ? <Redirect to="/" /> : <Login 
            onSubmit={handleSubmitAuth}
            />}
          </Route>

          <Route path='/sign-up'>
            {isLoggedIn ? <Redirect to="/" /> : <Register 
            onSubmit={handleSubmitRegistr}
            />}
          </Route>

          <Route path='*'>
            <Redirect to='/sign-in' />
          </Route>
          </Switch>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddPlaceSubmit}
          />
          <DeleteCardPopup
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            card={selectedCard}
            onCardDelete={() => handleCardDelete(cardDelete)}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup 
            onClose={closeAllPopups} card={selectedCard} 
          />
          <InfoTooltip
            name="infotooltip"
            isOpen={isToolTipPopupOpen}
            toolTipMessage={toolTipMessage}
            onClose={closeAllPopups}
        />

        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
