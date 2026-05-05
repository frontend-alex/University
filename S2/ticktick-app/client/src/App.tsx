import { Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";

import { Loading, Unauthorized } from "./routes/(errors)";
import {
  Calendar,
  Chat,
  Completed,
  Inbox,
  List,
  ListSettings,
  Onboarding,
  Profile,
  Settings,
  Trash,
  WorkspaceSettings,
} from "./routes/(root)";
import {
  AuthCallback,
  Login,
  Otp,
  Register,
  LandingRedirect,
} from "./routes/(auth)";
import {
  RootLayout,
  LoggedInLayout,
  ProfileLayout,
  PremiumLayout,
  ChatLayout,
} from "./components/layouts";
import Billing from "./routes/(root)/billing/Billing";
import TitleWrapper from "./components/TitleWrapper";

import { OnboardingGuard } from "./components/layouts/OnboardingLayout";
import ChatId from "./routes/(root)/chats/ChatId";

const NotFound = React.lazy(() => import("./routes/(errors)/NotFound"));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <TitleWrapper title="Welcome | Ticktick Clone">
              <LandingRedirect />
            </TitleWrapper>
          }
        />
        <Route
          path="/auth/callback"
          element={
            <TitleWrapper title="Authenticating...">
              <AuthCallback />
            </TitleWrapper>
          }
        />

        {/* Auth Routes */}
        <Route element={<LoggedInLayout />}>
          <Route
            path="/login"
            element={
              <TitleWrapper title="Login | Ticktick Clone">
                <Login />
              </TitleWrapper>
            }
          />
          <Route
            path="/verify-email"
            element={
              <TitleWrapper title="Verify Email | Ticktick Clone">
                <Otp />
              </TitleWrapper>
            }
          />
          <Route
            path="/create-account"
            element={
              <TitleWrapper title="Create Account | Ticktick Clone">
                <Register />
              </TitleWrapper>
            }
          />
        </Route>

        {/* Onboarding */}
        <Route element={<OnboardingGuard />}>
          <Route
            path="/onboarding"
            element={
              <TitleWrapper title="Get Started | Ticktick Clone">
                <Onboarding />
              </TitleWrapper>
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route element={<RootLayout />}>
          <Route
            path="/:workspaceId/inbox"
            element={
              <TitleWrapper title="Inbox | Ticktick Clone">
                <Inbox />
              </TitleWrapper>
            }
          />
          <Route
            path="/workspace/:workspaceId/settings"
            element={
              <TitleWrapper title="Workspace Settings | Ticktick Clone">
                <ChatLayout>
                  <WorkspaceSettings />
                </ChatLayout>
              </TitleWrapper>
            }
          />
          <Route
            path="/workspace/:workspaceId/chats"
            element={
              <TitleWrapper title="Chats | Ticktick Clone">
                <ChatLayout>
                  <Chat />
                </ChatLayout>
              </TitleWrapper>
            }
          />
          <Route
            path="/workspace/:workspaceId/chats/:chatId"
            element={
              <TitleWrapper title="Chats | Ticktick Clone">
                <ChatLayout>
                  <ChatId />
                </ChatLayout>
              </TitleWrapper>
            }
          />
          <Route
            path="/workspace/:workspaceId/trash"
            element={
              <TitleWrapper title="Trash | Ticktick Clone">
                <Trash />
              </TitleWrapper>
            }
          />

          <Route element={<PremiumLayout />}>
            <Route
              path="/calendar"
              element={
                <TitleWrapper title="Calendar | Ticktick Clone">
                  <Calendar />
                </TitleWrapper>
              }
            />
            <Route
              path="/workspace/:workspaceId/completed"
              element={
                <TitleWrapper title="Completed Tasks | Ticktick Clone">
                  <Completed />
                </TitleWrapper>
              }
            />
          </Route>

          <Route
            path="/:listId/:listName"
            element={
              <TitleWrapper title="Task List | Ticktick Clone">
                <List />
              </TitleWrapper>
            }
          />

          <Route
            path="/:listId/settings"
            element={
              <TitleWrapper title="Task List | Ticktick Clone">
                <ListSettings />
              </TitleWrapper>
            }
          />

          <Route element={<ProfileLayout />}>
            <Route
              path="/profile"
              element={
                <TitleWrapper title="Your Profile | Ticktick Clone">
                  <Profile />
                </TitleWrapper>
              }
            />
            <Route
              path="/settings"
              element={
                <TitleWrapper title="Settings | Ticktick Clone">
                  <Settings />
                </TitleWrapper>
              }
            />
            <Route
              path="/billing"
              element={
                <TitleWrapper title="Billing | Ticktick Clone">
                  <Billing />
                </TitleWrapper>
              }
            />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route
          path="/unauthorized"
          element={
            <TitleWrapper title="Unauthorized | Ticktick Clone">
              <Unauthorized />
            </TitleWrapper>
          }
        />
        <Route
          path="*"
          element={
            <TitleWrapper title="Page Not Found | Ticktick Clone">
              <NotFound />
            </TitleWrapper>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
