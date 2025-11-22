'use client'

import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";
import {useForm} from "react-hook-form";
import {signInWithEmail, signUpWithEmail} from "@/lib/action/auth.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const SignIn = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<SignInFormData>(
        {
            defaultValues: {
                email: '',
                password: '',
            },
            mode: 'onBlur'
        }
    );

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            if (result.success) router.push('/');
        } catch (error) {
            console.log(error);
            toast.error('Sign in failed. Please try again.', {
                description: error instanceof Error ? error.message : 'Failed to sign in. Please try again.',
            })
        }
    }

    return (
        <>
            <h1 className="form-title">Log In Your Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField name="email"
                            label="Email"
                            type="email"
                            placeholder="BenjaminNguyen@gmail.com"
                            register={register}
                            error={errors.email}
                            validation={{
                                required: 'Email is required',
                                pattern: {value: /^\S+@\S+$/i, message: 'Email is invalid'}
                            }}/>
                <InputField name="password"
                            label="Password"
                            placeholder="Enter your password"
                            register={register}
                            error={errors.password}
                            type="password"
                            validation={{
                                required: 'Password is required',
                                minLength: {value: 6, message: 'Password must be at least 6 characters long'}
                            }}/>
                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing in . . .' : 'Log In Now'}
                </Button>
                <FooterLink
                    text="Forgot your password?"
                    linkText="Register"
                    href="/sign-up"
                />
            </form>
        </>
    );
};

export default SignIn;
