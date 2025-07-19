import { sellerEvent } from "@/utill/action/sellerActions/sellerEvents";
import { redisSub } from "@/utill/connectDB";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get("sid");
  const stream = new ReadableStream({
    start(controller) {
      const send = (channel: string, data: string) => {
        console.log("starting emitter on redis pub/sub");
        const parsedData: { sellerId: string; oid: string } = JSON.parse(data);
        if (parsedData.sellerId === sellerId) {
          controller.enqueue(`data: ${parsedData.oid}\n\n`);
        }
      };
      redisSub.on("order-created", send);
      req.signal?.addEventListener("abort", () => {
        redisSub.off("order-created", send);
        controller.close();
      });
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
}
