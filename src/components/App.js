import React from "react";
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
  //хук для открытия попапа профиля
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  //хук для открытия попапа добавления новой карточки
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  //хук для открытия попапа аватара
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  //хук для открытия попапа удаления
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  //хук для открытия попапа с оповещением при авторизации
  const [isToolTipPopupOpen, setIsToolTipPopupOpen] = React.useState(false);
  //хук для сообщения об успешной/неуспешной авторизации
  const [toolTipMessage, setToolTipMessage] = React.useState({});
  //хук для открытия попапа большой картинки
  const [selectedCard, setSelectedCard] = React.useState({ name: "", link: "" });
  //хук для текущего пользователя
  const [currentUser, setCurrentUser] = React.useState({});
  //хук для карточек
  const [cards, setCards] = React.useState([]);
  //хук для удаления картинки именно нашей картинки
  const [cardDelete, setCardDelete] = React.useState();
  //хук для состояния пользователя(вошел он в систему или нет)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  //пропсы на открытие попапов
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

  React.useEffect(() => {
    tokenCheck();
      if(isLoggedIn)
        Promise.all([api.getInitialCards(), api.getUserInfo()])
          .then(([cards, userInfo]) => {
            setCurrentUser({ ...currentUser, ...userInfo });
            setCards(cards);
      })
          .catch((err) => `Не удалось получить карточки с сервера : ${err}`);
  }, [isLoggedIn]);

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

  function handleUpdateUser(user) {
    api
      .editUserInfo(user)
        .then((userInfo) => {
          setCurrentUser({ ...currentUser, ...userInfo });
          closeAllPopups();
        })
        .catch((err) => {
          console.log(`${err}`);
        });
    }

  function handleUpdateAvatar(avatar) {
    api
      .editUserAvatar(avatar)
      .then((userInfo) => {
        setCurrentUser({ ...currentUser, ...userInfo });
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
    // Проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        //Формируем новый массив на основе имеющегося, подставляя в него новую карточку
        setCards((state) =>
        //Обновляем стейт
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
      auth.getUser(jwt)
        .then(({ data: { email } }) => {
          setCurrentUser({ ...currentUser, email })
          setIsLoggedIn(true)
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header 
            onSignOut={signOut} 
          />
          <Switch>
          <ProtectedRoute exact path="/" isLoggedIn={isLoggedIn} component={Main} propsMain={propsMain} />
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
