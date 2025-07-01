import { sellerEvent } from "@/utill/action/sellerActions/sellerEvents";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get("sid");
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: Record<string, any>) => {
        console.log("starting emitter");
        if (data.sellerId === sellerId) {
          controller.enqueue(`data: ${data.oid}\n\n`);
        }
      };
      sellerEvent.on("order-created", send);
      req.signal?.addEventListener("abort", () => {
        sellerEvent.off("order-created", send);
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
