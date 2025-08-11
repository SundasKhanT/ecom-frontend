'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import appConstants from '../../../appConstants';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email' }),
  password: z.string().min(3, { message: 'Password must be at least 6 characters' }),
});

type FormData = z.infer<typeof formSchema>;

const page = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation<any, Error, FormData>({
    mutationFn: async (data) => {
      console.log(data);
      const res = await fetch(`${appConstants.BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return res.json();
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-10">
        <h1 className="text-3xl font-semibold text-[#1E293B] mb-8 text-center">
          Sign in to your account
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-base">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      autoComplete="email"
                      className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 mt-1 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-base">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      autoComplete="current-password"
                      className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 mt-1 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold py-3 rounded-md transition duration-200"
            >
              {mutation.isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>

        {mutation.isError && (
          <p className="mt-4 text-center text-red-600 text-sm">
            {(mutation.error as Error).message}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="mt-4 text-center text-green-600 text-sm">Login successful!</p>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <a href="#" className="text-blue-600 hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default page;
