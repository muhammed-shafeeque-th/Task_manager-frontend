import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/Field';
import { authApi } from '../api';
import { AuthShell } from '../components/AuthShell';
import { loginSchema, type LoginValues } from '../schemas';
import { useAuthStore } from '../store';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const { token, user } = await authApi.login(values);
      setSession(token, user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate((location.state as { from?: string } | null)?.from ?? '/', { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  return (
    <AuthShell
      title="Log in"
      subtitle="Pick up where you left off."
      footer={{ text: 'New to Taskboard?', linkLabel: 'Create an account', to: '/register' }}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError && (
          <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
            {formError}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="w-full">
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
