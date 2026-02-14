"use client";

import Link from "next/link";
import { Gift, Share2, BarChart3, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

const features = [
  {
    icon: Gift,
    title: "Создавайте списки",
    description:
      "Добавляйте подарки с ценами и ссылками. Организуйте списки для любого события.",
  },
  {
    icon: Share2,
    title: "Делитесь ссылкой",
    description:
      "Отправьте публичную ссылку друзьям и близким. Не нужна регистрация для просмотра.",
  },
  {
    icon: BarChart3,
    title: "Отслеживайте прогресс",
    description:
      "Следите за сбором средств в реальном времени. Друзья могут скидываться на подарки.",
  },
];

const steps = [
  {
    num: 1,
    title: "Зарегистрируйтесь",
    description: "Создайте аккаунт за пару секунд",
  },
  {
    num: 2,
    title: "Создайте список",
    description: "Добавьте подарки, которые хотите получить",
  },
  {
    num: 3,
    title: "Поделитесь ссылкой",
    description: "Отправьте друзьям — они смогут резервировать подарки",
  },
  {
    num: 4,
    title: "Получайте подарки",
    description: "Друзья увидят, что уже зарезервировано, и не повторятся",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 py-20 text-center sm:py-32">
          <div className="mx-auto max-w-3xl">
            <div className="bg-muted mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
              <Heart className="h-4 w-4" />
              Идеальные подарки без сюрпризов
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Создавайте списки желаний,{" "}
              <span className="text-primary">делитесь с друзьями</span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
              Больше никаких ненужных подарков. Создайте вишлист, поделитесь
              ссылкой, и пусть друзья выбирают из того, что вы действительно
              хотите.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">
                  Начать бесплатно
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Войти</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Всё, что нужно для идеальных подарков
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                    <feature.icon className="text-primary h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t px-4 py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Как это работает
            </h2>
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Готовы создать свой вишлист?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Присоединяйтесь и начните получать подарки, которые действительно
              хотите
            </p>
            <Button size="lg" asChild>
              <Link href="/register">
                Создать аккаунт
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
