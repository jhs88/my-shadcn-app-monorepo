const MAILPIT_URL =
  process.env.PLAYWRIGHT_MAILPIT_URL ?? "http://127.0.0.1:54324";

type MessageSummary = {
  ID: string;
  To?: { Address?: string }[];
};

async function firstLinkIn(messageId: string) {
  const response = await fetch(`${MAILPIT_URL}/api/v1/message/${messageId}`);
  if (!response.ok) {
    throw new Error(
      `Mailpit could not return ${messageId}: ${response.status}`,
    );
  }

  const message = (await response.json()) as { HTML?: string };
  const href = /href=["']([^"']+)/.exec(message.HTML ?? "")?.[1];

  return href ? href.replace(/&amp;/g, "&") : undefined;
}

/**
 * Read the newest link sent to `email` out of the local mail catcher.
 *
 * This is what makes the email flows real tests: the link comes from the
 * rendered template rather than from a hand-built URL.
 */
export async function latestLinkSentTo(
  email: string,
  { timeoutMs = 20_000 }: { timeoutMs?: number } = {},
) {
  const deadline = Date.now() + timeoutMs;
  let lastSeen = "no message for that address";

  while (Date.now() < deadline) {
    const response = await fetch(`${MAILPIT_URL}/api/v1/messages`);
    if (!response.ok) {
      throw new Error(`Mailpit could not list messages: ${response.status}`);
    }

    const { messages = [] } = (await response.json()) as {
      messages?: MessageSummary[];
    };
    const match = messages.find(
      (message) =>
        message.To?.[0]?.Address?.toLowerCase() === email.toLowerCase(),
    );

    if (match) {
      const link = await firstLinkIn(match.ID);
      if (link) return link;
      lastSeen = "a message with no link";
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(
    `No link reached ${email} within ${timeoutMs}ms (last saw ${lastSeen}).`,
  );
}
