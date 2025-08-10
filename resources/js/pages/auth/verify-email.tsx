// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, ArrowLeft } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'react-hot-toast';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});
    const [loading, setLoading] = useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        
        if (loading) return;

        setLoading(true);
        try {
            await post(route('verification.send'));
            toast.success('Verification email sent successfully!');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Verify Email" description="We've sent a verification link to your email address">
            <Head title="Email verification" />

            <div className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="p-4 text-center text-sm font-medium text-green-600 bg-green-50 rounded-lg border border-green-200">
                        A new verification link has been sent to the email address you provided during registration.
                    </div>
                )}

                <div className="text-center space-y-2">
                    <p className="text-muted-foreground">
                        Please check your email and click the verification link to activate your account.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Didn't receive the email? Check your spam folder or click the button below to resend.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <Button type="submit" className="w-full" disabled={loading || processing}>
                                {loading || processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                        Sending verification email...
                                    </>
                                ) : (
                                    'Resend verification email'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <TextLink href={route('logout')} method="post" className="inline-flex items-center text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to sign in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
