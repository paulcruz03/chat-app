"use client"

import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/firebase-client"

const FormSchema = z.object({
  email: z.string().min(8, {
    message: "Email must be at least 8 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function LoginForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "test@yopmail.com",
      password: "P@55w0rd",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitted(true)
    try {
      await signIn(data.email, data.password)
      toast.success("Login successful!")
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message)
      setIsSubmitted(false)
    }
  }

  return (
    <Card className="w-1/4">
      <CardHeader>
        <CardTitle className="text-center">LOGIN</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel className="w-20">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="sample@gmail.com" {...field} type="email" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel className="w-20">Password</FormLabel>
                  <FormControl>
                    <Input placeholder={showPassword ? "password" : "••••••••"} {...field} type={showPassword ? "input" : "password"} />
                  </FormControl>
                  <Button type="button" onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </FormItem>
              )}
            />
            <Button disabled={isSubmitted} type="submit" className="w-full mb-2">
              {isSubmitted ? <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Please wait
              </span> : <span>Login</span>}
            </Button>
            {/* <Button onClick={signInWithGoogle} disabled={isSubmitted} type="button" variant="outline" className="w-full">
              {isSubmitted ? <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Please wait
              </span> : <span>Login with Google</span>}
            </Button> */}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
