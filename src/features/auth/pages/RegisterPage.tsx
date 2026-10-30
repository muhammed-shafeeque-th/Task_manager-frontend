import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/Field';
import { authApi } from '../api';
import { AuthShell } from '../components/AuthShell';
import { registerSchema, type RegisterValues } from '../schemas';
import { useAuthStore } from '../store';

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const { token, user } = await authApi.register(values);
      setSession(token, user);
      toast.success('Account created');
      navigate('/', { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  return (
    <AuthShell
      title="Create your account"
      subtitle="Track tasks and see changes appear on every device instantly."
      footer={{ text: 'Already have an account?', linkLabel: 'Log in', to: '/login' }}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextField label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <TextField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError && (
          <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
            {formError}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
