import LoginForm from '../../components/auth/LoginForm'

const LoginPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h1>
        <p className="text-gray-600">Welcome back! Please enter your details.</p>
      </div>
      <LoginForm />
    </div>
  )
}

export default LoginPage