export async function startMockServiceWorker() {
  if (typeof window === "undefined") return;

  // @ts-ignore
  const { worker } = await import("./browser.ts");
  await worker.start({
    onUnhandledRequest(request, print) {
      // Only warn about external unhandled requests
      const url = new URL(request.url);
      if (url.origin !== window.location.origin) {
        print.warning();
      }
    },
  });
}
