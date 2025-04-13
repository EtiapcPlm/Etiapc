// version1
// author Yxff
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import CoordinatorDashboard from "@/components/dashboard/CoordinatorDashboard";
import AdministratorDashboard from "@/components/dashboard/AdministratorDashboard";

type UserRole = 'teacher' | 'coordinator' | 'administrator';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log('Session en page:', session);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userRole = session.user.role as UserRole;
  console.log('UserRole en page:', userRole);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {userRole === "teacher" && <TeacherDashboard />}
      {userRole === "coordinator" && <CoordinatorDashboard />}
      {userRole === "administrator" && <AdministratorDashboard />}
    </div>
  );
}
