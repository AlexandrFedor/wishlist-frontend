import { LoginForm } from "@/components/features/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift } from "lucide-react";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mb-2 flex justify-center">
          <Gift className="h-10 w-10" />
        </div>
        <CardTitle className="text-2xl">Вход</CardTitle>
        <CardDescription>Войдите в свой аккаунт Вишлистович</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
