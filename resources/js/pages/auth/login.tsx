import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (loading) return;

        // Validation
        const validationErrors: string[] = [];
        if (!data.email || !isValidEmail(data.email)) {
            validationErrors.push('email');
        }
        if (!data.password) {
            validationErrors.push('password');
        }

        if (validationErrors.length > 0) {
            toast.error('Please fill in all required fields correctly.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/login', {
                email: data.email,
                password: data.password,
            });

            if (response.data.status) {
                // Redirect to dashboard on successful login
                window.location.href = '/dashboard';
            } else {
                toast.error(response.data.message || 'An error occurred. Please try again later.');
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email: string) => {
        const re = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    return (
        <AuthLayout title="Sign In" description="Enter your email and password to sign in!">
            <Head title="Sign in" />

            <div className="space-y-6">
                {/* Google Sign In */}
                <div className="space-y-4">
                    <Button variant="outline" className="w-full" asChild>
                        <a href="/auth/google">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2"
                            >
                                <path
                                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                                    fill="#EB4335"
                                />
                            </svg>
                            Sign in with Google
                        </a>
                    </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-background text-muted-foreground">
                            Or continue with email
                        </span>
                    </div>
                </div>

                {/* Login Form */}
                <Card>
                    <CardContent className="pt-6">
                        <form className="space-y-4" onSubmit={handleSignIn}>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email <span className="text-error-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="info@gmail.com"
                                    className="w-full"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password <span className="text-error-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={isChecked}
                                        onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                                    />
                                    <Label htmlFor="remember" className="text-sm font-normal">
                                        Keep me logged in
                                    </Label>
                                </div>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-sm text-primary hover:text-primary/80">
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={loading || processing}>
                                {loading || processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-sm font-normal text-gray-700 dark:text-gray-400 sm:text-start">
                        Don't have an account?{' '}
                        <TextLink href={route('register')} className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                            Sign Up
                        </TextLink>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
