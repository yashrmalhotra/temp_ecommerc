import { Inngest } from "inngest";
const inngestBaseUrl = process.env.INNGEST_BASE_URL!;
const inngestEventKey = process.env.INNGEST_EVENT_KEY!;
const inngestSigningKey = process.env.INNGEST_SIGNING_KEY;
export const inngest = new Inngest({
  id: "Ecommerce",
});
