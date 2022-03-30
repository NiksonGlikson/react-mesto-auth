import React from 'react';
import { Link } from 'react-router-dom';

function Register(props) {

    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');

    function handleChangeEmail(evt) {
        setEmail(evt.target.value);
    }

    function handleChangePassword(evt) {
        setPassword(evt.target.value);
    }

    function handleSubmitRegistr(evt) {
        evt.preventDefault();
        props.onSubmit({ email, password });
    }

    return (
        <section className='register'>
            <h1 className='register__title'>Регистрация</h1>
            <form className='register__form' onSubmit={handleSubmitRegistr}>
                <input
                    name='email'
                    id='email'
                    type='email'
                    placeholder='Email'
                    className='register__input register__input_type_email'
                    required
                    onChange={handleChangeEmail}
                    value={email}
                />
                <input
                    name='password'
                    id='password'
                    type='password'
                    placeholder='Пароль'
                    className='register__input register__input_type_password'
                    required
                    onChange={handleChangePassword}
                    value={password}
                    minLength='8'
                    maxLength='16'
                />
                <button type='submit' className='register__button'>
                    Зарегистрироваться
                </button>
            </form>
            <Link to='/sign-in' className='register__link'>
                Уже зарегистрированы? Войти
            </Link>
        </section>
    )
}



export default Register;