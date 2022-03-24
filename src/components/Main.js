import React from 'react';
import Card from '../components/Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';


function Main({ 
	onEditAvatar,
	onEditProfile,
	onAddPlace,
	onCardClick,
	onCardLike,
	onCardDelete,
	cards }) 
	{
	
	const currentUser = React.useContext(CurrentUserContext);

	return (
		<main className="main">
			<section className="profile">
				<button 
				className="profile__button-avatar"
				type="button"
				onClick={onEditAvatar}
				>
				<img 
				className="profile__avatar"
				name="avatar"
				alt="Ваше фото профиля"
				src={currentUser.avatar}
				/>
				</button>
				<div className="profile__container">
					<div className="profile__info">
						<div className="profile__description">
							<h1 className="profile__title">{currentUser.name}</h1>
							<button 
							className="profile__button-edit"
							type="button"
							onClick={onEditProfile}>
							</button>
						</div>
						<p className="profile__subtitle">{currentUser.about}</p>
					</div>
				</div>
				<button 
				className="profile__button-add"
				type="button"
				onClick={onAddPlace}>
				</button>
			</section>

			<section className="elements">
				{cards.map((card) => (
					<Card
						key={card._id}
						card={card}
						onCardClick={onCardClick}
						onCardLike={onCardLike}
						onCardDelete={onCardDelete}
					/>
				))}
			</section>
		</main>
	);
}

export default Main;
