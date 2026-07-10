import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useLoginMutation } from "@/api/apiSlice";
import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setCredentials } from "@/features/auth/authSlice";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const result = await login(values).unwrap();
      localStorage.setItem("krishisetu_refresh_token", result.refreshToken);
      dispatch(setCredentials({ accessToken: result.accessToken, user: result.user }));
      toast.success("Welcome back");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-10 md:grid-cols-2">
      <div className="hidden pr-10 md:block">
        <h1 className="text-5xl font-extrabold">Operate the farm economy with confidence.</h1>
        <p className="mt-4 text-muted-foreground">One Plateform for buyers, farmers, providers, delivery partners, store owners.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Email" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <Input type="password" placeholder="Password" {...register("password")} />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>
            <Button className="w-full" disabled={isLoading}>{isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in</Button>
          </form>
          <p className="mt-5 text-sm text-muted-foreground">New to KrishiSetu? <Link className="font-semibold text-primary" to="/register">Create account</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
