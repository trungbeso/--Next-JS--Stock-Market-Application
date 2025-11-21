import {serve} from 'inngest/next'
import {ingest} from "@/lib/inngest/client";
import {sendSignUpEmail} from "@/lib/inngest/function";

export const {GET, POST, PUT} = serve({
    client: ingest,
    functions: [sendSignUpEmail],
})
