'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('gce_user', JSON.stringify({ 
      name: name, 
      email: email, 
      tier: 'Gold',
      memberSince: new Date().toLocaleDateString()
    }))
    router.push('/dashboard')
  }

  const handleGoogleSignup = () => {
    localStorage.setItem('gce_user', JSON.stringify({ 
      name: 'Google_User', 
      email: 'user@gmail.com', 
      tier: 'Gold',
      memberSince: new Date().toLocaleDateString()
    }))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8"><div className="text-4xl font-bold text-primary mb-2">GCE</div><h1 className="text-2xl font-bold text-gray-800">Create Account</h1><p className="text-gray-500 text-sm mt-1">Join Growth Central Events today</p></div>
        <div className="flex gap-4 mb-6"><Link href="/login" className="flex-1 py-2 text-gray-500 hover:text-gray-700 text-center">Login</Link><button className="flex-1 py-2 border-b-2 border-primary text-primary font-semibold">Sign Up</button></div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your full name" required /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" required /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Create a password (min 6 characters)" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition">Sign Up</button>
        </form>
        <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or</span></div></div>
        <button onClick={handleGoogleSignup} className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">🔐 Sign up with Google</button>
        <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Login</Link></p>
      </div>
    </div>
  )
}
