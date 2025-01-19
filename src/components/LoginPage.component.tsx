import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '../utils/supabase';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h1>Choredos</h1>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />
    </div>
  );
};

export default LoginPage;
