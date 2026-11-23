import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setAuthenticated, setLoading, setError } from '../authSlice';
import { mockAuthService } from '../../../services/mock/mockAuthService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Login ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    console.log('Form submitted:', data);
    dispatch(setLoading(true));
    try {
      const response = await mockAuthService.login(data.identifier, data.password);
      console.log('Auth response:', response);
      dispatch(setAuthenticated({ user: response.user }));
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Auth error:', err);
      dispatch(setError(err.message));
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#faf9f5] p-6'>
      <Card className='w-full max-w-md'>
        <h2 className='text-2xl font-bold text-[#0b4d24] mb-6'>Employer Login</h2>
        {error && <div className='bg-red-100 text-red-700 p-3 rounded mb-4'>{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label='Login ID' {...register('identifier')} error={errors.identifier?.message as string} />
          <Input label='Password' type='password' {...register('password')} error={errors.password?.message as string} />
          <Button type='submit' fullWidth isLoading={loading}>Log in</Button>
        </form>
      </Card>
    </div>
  );
};
