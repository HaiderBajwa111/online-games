import { redirect } from 'next/navigation';

interface RedirectProps {
    params: Promise<{ slug: string }>;
}

export default async function LegacyGameRedirect({ params }: RedirectProps) {
    const resolved = await params;
    // Instantly redirect all old traffic navigating to `/game/jump-only` into the new default English localized system
    redirect(`/en/game/${resolved.slug}`);
}
