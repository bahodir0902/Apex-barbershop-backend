import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Scissors, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

interface LoginFormData {
  email_or_phone: string;
  password: string;
  remember: boolean;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email_or_phone, data.password, data.remember);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.detail || 'Login failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-dark-900">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600">
              <Scissors className="h-5 w-5 text-dark-950" />
            </div>
            <span className="text-xl font-bold gradient-text">ApeX</span>
          </Link>

          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-dark-500 dark:text-dark-400 mb-8">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email or Phone"
              type="text"
              placeholder="Enter your email or phone"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email_or_phone?.message}
              {...register('email_or_phone', {
                required: 'Email or phone is required',
              })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-dark-400 hover:text-dark-600 dark:hover:text-dark-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-dark-300 text-gold-500 focus:ring-gold-500"
                  {...register('remember')}
                />
                <span className="text-sm text-dark-600 dark:text-dark-400">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-gold-600 hover:text-gold-700 dark:text-gold-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-dark-500 dark:text-dark-400">
              Don't have an account?{' '}
            </span>
            <Link
              to="/register"
              className="text-gold-600 hover:text-gold-700 dark:text-gold-400 font-medium"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a02c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-flex p-8 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 mb-8"
          >
            <Scissors className="h-24 w-24 text-gold-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Premium Grooming Experience
          </h2>
          <p className="text-dark-300 max-w-md">
            Join ApeX today and discover the finest barbershop experience with professional barbers.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
