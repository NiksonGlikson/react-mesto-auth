import React from "react";

function Login(props) {

  //хук получения пароля пользователя, для отображения в хедере
  const [password, setPassword] = React.useState('');
  //хук для получения почты пользователя, для отображения в хедере
  const [email, setEmail] = React.useState('');

  function handleChangeEmail(evt) {
    setEmail(evt.target.value);
  }

  function handleChangePassword(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmitLogin(evt) {
    evt.preventDefault();
    props.onSubmit({ email, password });
  }

  return (
    <section className="login">
      <h1 className="login__title">Вход</h1>
      <form className="login__form" onSubmit={handleSubmitLogin}>
        <input
          name='email'
          id='email'
          type='email'
          placeholder='Email'
          className="login__input login__input_type_email"
          required
          onChange={handleChangeEmail}
          value={email}
        />
        <input
          name='password'
          id='password'
          type='password'
          placeholder='Пароль'
          className='login__input login__input_type_password'
          required
          onChange={handleChangePassword}
          value={password}
        />
        <button
          className="login__button"
          type="submit"
        >
          Войти
        </button>
      </form>
    </section>
  );
}

export default Login;