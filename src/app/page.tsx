"use client";

import { useApp } from "@/lib/store";
import { PublicLayout } from "@/components/layout/public-layout";
import { AppLayout } from "@/components/layout/app-layout";
import { HomeView } from "@/components/views/home-view";
import { HowItWorksView } from "@/components/views/how-it-works";
import { FeaturesView } from "@/components/views/features-view";
import { AntennaLibraryView } from "@/components/views/antenna-library";
import { LibraryDetailView } from "@/components/views/library-detail";
import { LearningCenterView } from "@/components/views/learning-center";
import { LessonDetailView } from "@/components/views/lesson-detail";
import { HFSSLearningView } from "@/components/views/hfss-learning";
import { HFSSLessonDetailView } from "@/components/views/hfss-lesson-detail";
import { AICopilotInfoView } from "@/components/views/ai-copilot-info";
import { ExperimentsView } from "@/components/views/experiments";
import { ResearchView } from "@/components/views/research";
import { AboutView } from "@/components/views/about";
import { LoginView } from "@/components/views/auth/login-view";
import { RegisterView } from "@/components/views/auth/register-view";
import { DashboardView } from "@/components/views/dashboard";
import { NewProjectView } from "@/components/views/new-project";
import { ProjectWorkspaceView } from "@/components/views/project-workspace";
import { AIVAFloatingButton } from "@/components/aiva/aiva-floating";
import { AivaPanel } from "@/components/aiva/aiva-panel";

export default function Home() {
  const view = useApp((s) => s.view);
  const user = useApp((s) => s.user);

  const isAuthedView =
    view === "dashboard" ||
    view === "new-project" ||
    view === "project-workspace";

  // If user tries to access authed views without being logged in, redirect to login
  if (isAuthedView && !user) {
    return (
      <PublicLayout>
        <LoginView />
        <AIVAFloatingButton />
        <AivaPanel />
      </PublicLayout>
    );
  }

  // Authenticated layout
  if (isAuthedView) {
    return (
      <AppLayout>
        {view === "dashboard" && <DashboardView />}
        {view === "new-project" && <NewProjectView />}
        {view === "project-workspace" && <ProjectWorkspaceView />}
        <AIVAFloatingButton />
        <AivaPanel />
      </AppLayout>
    );
  }

  // Public layout (also used for learning/library/hfss which can be viewed by anyone)
  return (
    <PublicLayout>
      {view === "home" && <HomeView />}
      {view === "how-it-works" && <HowItWorksView />}
      {view === "features" && <FeaturesView />}
      {view === "antenna-library" && <AntennaLibraryView />}
      {view === "library-detail" && <LibraryDetailView />}
      {view === "learning-center" && <LearningCenterView />}
      {view === "lesson-detail" && <LessonDetailView />}
      {view === "hfss-learning" && <HFSSLearningView />}
      {view === "hfss-lesson-detail" && <HFSSLessonDetailView />}
      {view === "ai-copilot-info" && <AICopilotInfoView />}
      {view === "experiments" && <ExperimentsView />}
      {view === "research" && <ResearchView />}
      {view === "about" && <AboutView />}
      {view === "login" && <LoginView />}
      {view === "register" && <RegisterView />}
      <AIVAFloatingButton />
      <AivaPanel />
    </PublicLayout>
  );
}
