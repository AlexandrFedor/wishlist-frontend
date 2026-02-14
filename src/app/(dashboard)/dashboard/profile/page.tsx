"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { ProfileForm } from "@/components/features/auth/profile-form";
import { PageContainer } from "@/components/shared/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();

  return (
    <PageContainer className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Профиль</h1>

      <Card>
        <CardHeader>
          <CardTitle>Личные данные</CardTitle>
          <CardDescription>Обновите информацию о себе</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Тема оформления</CardTitle>
          <CardDescription>Выберите тему для интерфейса</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="flex-1"
            >
              <Sun className="mr-2 h-4 w-4" />
              Светлая
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="flex-1"
            >
              <Moon className="mr-2 h-4 w-4" />
              Тёмная
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="flex-1"
            >
              <Monitor className="mr-2 h-4 w-4" />
              Системная
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
