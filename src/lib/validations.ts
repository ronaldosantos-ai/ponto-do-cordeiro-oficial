import { z } from 'zod';

// Schema de validação para autenticação
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email é obrigatório" })
  .max(255, { message: "Email deve ter no máximo 255 caracteres" })
  .email({ message: "Email inválido" });

export const passwordSchema = z
  .string()
  .min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
  .max(128, { message: "Senha deve ter no máximo 128 caracteres" });

export const authLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const authSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"]
});

export const authForgotSchema = z.object({
  email: emailSchema
});

// Schema para simulação
export const simulacaoSchema = z.object({
  peso: z.number().positive({ message: "Peso deve ser maior que zero" }).max(500, { message: "Peso inválido" }),
  dias: z.number().int().positive({ message: "Dias deve ser maior que zero" }).max(1000, { message: "Dias inválido" }),
  custo: z.number().nonnegative({ message: "Custo não pode ser negativo" }),
  precoVenda: z.number().positive({ message: "Preço de venda deve ser maior que zero" })
});

// Tipos inferidos
export type AuthLoginData = z.infer<typeof authLoginSchema>;
export type AuthSignupData = z.infer<typeof authSignupSchema>;
export type SimulacaoData = z.infer<typeof simulacaoSchema>;
