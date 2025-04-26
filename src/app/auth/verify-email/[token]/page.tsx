import { VerifyEmailClient } from "./verify-email-client";

interface PageProps {
  params: {
    token: string;
  };
}

export default function VerifyEmailPage({ params }: PageProps) {
  return <VerifyEmailClient token={params.token} />;
} 

