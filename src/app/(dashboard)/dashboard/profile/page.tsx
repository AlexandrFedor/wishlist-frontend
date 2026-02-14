"use client";

import { ProfileForm } from "@/components/features/auth/profile-form";
import { PageContainer } from "@/components/shared/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <PageContainer className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Профиль</h1>
      <Card>
        <CardHeader>
          <CardTitle>Личные данные</CardTitle>
          <CardDescription>
            Обновите информацию о себе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
