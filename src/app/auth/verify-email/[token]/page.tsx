import { VerifyEmailClient } from "./verify-email-client";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function VerifyEmailPage({ params }: Props) {
  const resolvedParams = await params;
  return <VerifyEmailClient token={resolvedParams.token} />;
} 

