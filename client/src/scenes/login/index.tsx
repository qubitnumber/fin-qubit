import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { successToast, errorToast } from '@/utils/toast';
import FormInput from "@/components/FormInput";
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoadingButton as _LoadingButton } from '@mui/lab';

import { useLoginUserMutation, useSendOptMutation } from '@/redux/api/authApi';

const LoadingButton = styled(_LoadingButton)`
  padding: 0.6rem 0;
  background-color: #f9d13e;
  color: #2363eb;
  font-weight: 500;

  &:hover {
    background-color: #ebc22c;
    transform: translateY(-2px);
  }
`;

const LinkItem = styled(Link)`
  text-decoration: none;
  color: #2363eb;
  &:hover {
    text-decoration: underline;
  }
`;

const loginSchema = object({
  email: string()
    .min(1,'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1,'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // ? API Login Mutation
  const [loginUser, { data, isLoading, isError, error, isSuccess }] =
    useLoginUserMutation();
  const [sendOpt] = useSendOptMutation();
  const navigate = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const from = ((location.state as any)?.from.pathname as string) || '/profile';

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;


  useEffect(() => {
    if (isSuccess) {
      if (!data?.isVerified && data?.email) {
        sendOpt({email: data.email})
        navigate('/verifyemail');
      } else {
        successToast('🦄 You successfully logged in');
        navigate(from);
      }
    }
    if (isError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (Array.isArray((error as any).data.error)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).data.error.forEach((el: any) =>
        errorToast(el.message)
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorToast((error as any).data.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    // ? Executing the loginUser Mutation
    loginUser(values);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#2363eb',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          textAlign='center'
          component='h1'
          sx={{
            color: '#f9d13e',
            fontWeight: 600,
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 2,
            letterSpacing: 1,
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant='body1'
          component='h2'
          sx={{ color: '#e5e7eb', mb: 2 }}
        >
          Login to have access!
        </Typography>

        <FormProvider {...methods}>
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete='off'
            maxWidth='27rem'
            width='100%'
            sx={{
              backgroundColor: '#e5e7eb',
              p: { xs: '1rem', sm: '2rem' },
              borderRadius: 2,
            }}
          >
            <FormInput name='email' label='Email Address' type='email' />
            <FormInput name='password' label='Password' type='password' />

            <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
              Need an account? <LinkItem to='/register'>Sign Up Here</LinkItem>
            </Typography>

            <LoadingButton
              variant='contained'
              sx={{ mt: 1 }}
              fullWidth
              disableElevation
              type='submit'
              loading={isLoading}
            >
              Login
            </LoadingButton>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default LoginPage;

