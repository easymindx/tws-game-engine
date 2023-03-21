import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';

export default function Login() {
  return (
    <AuthLayout>
      <div className="flex flex-col">
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Don’t have an account?{' '}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
      <form action="#" className="mt-10 grid grid-cols-1 gap-y-8">
        <TextField
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <TextField
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <div>
          <Button variant="solid" color="blue" className="w-full">
            <span>
              Sign in <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
