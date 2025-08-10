// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'react-hot-toast';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        
        if (loading) return;

        if (!data.password) {
            toast.error('Please enter your password.');
            return;
        }

        setLoading(true);
        try {
            await post(route('password.confirm'), {
                onFinish: () => reset('password'),
            });
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Confirm Password" description="This is a secure area of the application. Please confirm your password before continuing.">
            <Head title="Confirm password" />

            <div className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                        <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password <span className="text-error-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        value={data.password}
                                        autoFocus
                                        className="w-full pr-10"
                                        onChange={(e) => setData('password', e.target.value)}
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

                            <Button type="submit" className="w-full" disabled={loading || processing}>
                                {loading || processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                        Confirming...
                                    </>
                                ) : (
                                    'Confirm password'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
