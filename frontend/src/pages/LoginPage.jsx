import LoginButton from "../components/loginButton"

export default function LoginPage() {
  return (
    <div>
      <h1>Habit Fortress</h1>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <LoginButton/>

    </div>
  )
}