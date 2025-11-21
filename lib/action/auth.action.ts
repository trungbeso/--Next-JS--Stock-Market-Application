'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";

export const signUpWithEmailAndPassword = async ({
                                                     email,
                                                     password,
                                                     fullName,
                                                     country,
                                                     investmentGoals,
                                                     riskTolerance,
                                                     preferredIndustry
                                                 }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: {email: email, password: password, name: fullName}
        });

        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email: email
                }
            })
        }

    } catch (err) {
        console.log(err);
        return {success: false, error: 'Sign up failed.'}
    }
}