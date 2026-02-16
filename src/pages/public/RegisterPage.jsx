import RegisterForm from '../../components/auth/RegisterForm'

const RegisterPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
        <p className="text-gray-600">Join thousands of freelancers and clients worldwide.</p>
      </div>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage