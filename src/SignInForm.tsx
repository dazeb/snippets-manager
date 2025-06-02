"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-bold text-center">
          {flow === "signIn" ? "Welcome back" : "Create account"}
        </CardTitle>
        <CardDescription className="text-center text-sm">
          {flow === "signIn"
            ? "Sign in to your account to continue"
            : "Create a new account to get started"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            const formData = new FormData(e.target as HTMLFormElement);
            void signIn("password", formData)
              .then((result) => {
                console.log("Authentication success:", result);
                toast.success(flow === "signIn" ? "Signed in successfully!" : "Account created successfully!");
                setSubmitting(false);
              })
              .catch((error) => {
                console.error("Authentication error:", error);
                let toastTitle = "";
                if (error.message.includes("Invalid password")) {
                  toastTitle = "Invalid password. Please try again.";
                } else if (error.message.includes("redirect")) {
                  toastTitle = "Authentication configuration error. Please try again.";
                } else {
                  toastTitle =
                    flow === "signIn"
                      ? "Could not sign in, did you mean to sign up?"
                      : "Could not sign up, did you mean to sign in?";
                }
                toast.error(`${toastTitle} (${error.message})`);
                setSubmitting(false);
              });
          }}
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              disabled={submitting}
            />
          </div>

          {/* Hidden input for flow - this is the correct way according to Convex Auth docs */}
          <input name="flow" type="hidden" value={flow} />

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
            size="lg"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {flow === "signIn" ? "Signing in..." : "Creating account..."}
              </div>
            ) : (
              flow === "signIn" ? "Sign in" : "Create account"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              disabled={submitting}
            >
              {flow === "signIn" ? "Sign up" : "Sign in"}
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
