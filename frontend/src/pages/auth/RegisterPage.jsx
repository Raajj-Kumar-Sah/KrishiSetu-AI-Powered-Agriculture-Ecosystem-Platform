import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useRegisterMutation } from "@/api/apiSlice";
import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setCredentials } from "@/features/auth/authSlice";

const roles = ["Buyer", "Farmer", "EquipmentProvider", "AgroStoreOwner", "DeliveryPartner"];
const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  role: z.enum(roles),
});

export default function RegisterPage() {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { role: "Buyer" } });

  const onSubmit = async (values) => {
    try {
      const result = await registerUser(values).unwrap();
      localStorage.setItem("krishisetu_refresh_token", result.refreshToken);
      dispatch(setCredentials({ accessToken: result.accessToken, user: result.user }));
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader><CardTitle>Create your KrishiSetu account</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Full name" {...register("name")} />
            <Input placeholder="Email" {...register("email")} />
            <Input placeholder="Phone" {...register("phone")} />
            <Input type="password" placeholder="Password" {...register("password")} />
            <select className="focus-ring h-11 rounded-lg border bg-white px-3 text-sm md:col-span-2" {...register("role")}>
              {roles.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            {Object.values(errors)[0] && <p className="text-sm text-red-600 md:col-span-2">{Object.values(errors)[0].message}</p>}
            <Button className="md:col-span-2" disabled={isLoading}>{isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Create account</Button>
          </form>
          <p className="mt-5 text-sm text-muted-foreground">Already have an account? <Link className="font-semibold text-primary" to="/login">Sign in</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
