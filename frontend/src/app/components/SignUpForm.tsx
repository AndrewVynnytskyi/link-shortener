import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CloseButton from '@/app/components/CloseButton';
import { RefObject, useRef } from "react";
import InputField from '@/app/components/InputField';
import Form from '@/app/components/Form';
import Overlay from "@/app/components/Overlay";

type SignUpFormFieldNames = 'username' | 'email' | 'password' | 'confirmPassword';

export default function SignUpForm({ref} : {ref: RefObject<any>}) {
  const form = useForm(
    {
      defaultValues: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      validators: {
        onChange: z.object({
          username: z.string().min(3, 'Your username have to be longer than 3 letters'),
          email: z.string().email('You have to write valid email'),
          password: z.string()
            .min(8, 'Password must be at least 8 characters long')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/\d/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
          confirmPassword: z.string(),
        }).refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        }),
      },
      onSubmit: async ({ value }) => {
        await axios({
          method: 'POST',
          url: process.env.NEXT_PUBLIC_API_KEY + '/auth/signup',
          data: {
            username: value.username,
            password: value.password,
            email: value.email,
          },
        }).then(() => {
          toast.success('You successfully singed up. Now please login');
        }).catch((e) => toast.error('Error: ' + e));
      },
    },
  );


  const formData: { name: SignUpFormFieldNames; placeholder: string, type: string }[] = [
    { name: 'username', placeholder: 'Enter your username', type: 'text' },
    { name: 'email', placeholder: 'Enter your email', type: 'email' },
    { name: 'password', placeholder: 'Enter your password', type: 'password' },
    { name: 'confirmPassword', placeholder: 'Confirm your password', type: 'password' },
  ];

  const SignUpFormComponents = formData.map(({ name, placeholder, type }) => (
    <form.Field key={name} name={name}>
      {(field) => <InputField field={field} placeholder={placeholder} type={type}/>}
    </form.Field>
  ));

  return (
    <Overlay ref={ref}>
      <h2>Sign Up</h2>
      <Form formComponents={SignUpFormComponents} form={form} submitButtonText={'Sign Up'} />
    </Overlay>
  );
}