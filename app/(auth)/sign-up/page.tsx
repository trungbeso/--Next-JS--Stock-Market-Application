'use client'

import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constants";
import CountrySelectField from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import {signUpWithEmail} from "@/lib/action/auth.action";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

const SignUp = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting}
    } = useForm<SignUpFormData>({
            defaultValues: {
                fullName: '',
                email: '',
                password: '',
                country: 'VN',
                investmentGoals: 'Growth',
                riskTolerance: 'Medium',
                preferredIndustry: 'Technology'
            },
            mode: 'onBlur'
        }
    );

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if (result.success) router.push('/');
        } catch (error) {
            console.log(error);
            toast.error('Sign up failed. Please try again.', {
                description: error instanceof Error ? error.message : 'Failed to create account.',
            })
        }
    }

    return (
        <>
            <h1 className="form-title">Sign Up & Personalize</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField name="fullName"
                            label="Full Name"
                            placeholder="Benjamin Nguyen"
                            register={register}
                            error={errors.fullName}
                            validation={{
                                required: 'Full name is required',
                                minLength: {value: 3, message: 'Full name must be at least 3 characters long'}
                            }}/>
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
                            placeholder="Enter a strong password"
                            register={register}
                            error={errors.password}
                            type="password"
                            validation={{
                                required: 'Password is required',
                                minLength: {value: 6, message: 'Password must be at least 6 characters long'}
                            }}/>

                {/*Country*/}
                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                    required
                    placeholder="Select your country"
                />

                <SelectField
                    name="investmentGoals"
                    label="Investment Goals"
                    placeholder="Select your investment goal"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />
                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="Select your risk level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />
                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select your preferred industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Creating Account...' : 'Start Trading Now'}
                </Button>
                <FooterLink
                    text="Already have an account?"
                    linkText="Sign in"
                    href="/sign-in"
                />
            </form>
        </>
    );
};

export default SignUp;
