// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, ArrowLeft } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'react-hot-toast';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const [loading, setLoading] = useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        
        if (loading) return;

        // Validation
        if (!data.email || !isValidEmail(data.email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await post(route('password.email'));
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email: string) => {
        const re = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    return (
        <AuthLayout title="Forgot Password" description="Enter your email to reset password!">
            <Head title="Forgot password" />

            <div className="space-y-6">
                {status && (
                    <div className="p-4 text-center text-sm font-medium text-green-600 bg-green-50 rounded-lg border border-green-200">
                        {status}
                    </div>
                )}

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email <span className="text-error-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={data.email}
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading || processing}>
                                {loading || processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                        Sending reset link...
                                    </>
                                ) : (
                                    'Send password reset link'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <TextLink href={route('login')} className="inline-flex items-center text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to sign in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
