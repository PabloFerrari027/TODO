import { Injectable } from '@nestjs/common';
import { UnimplementedLanguageError } from '../domain/erros/unimplemented-language-error';

type Language = 'pt-BR';

interface Output {
  head: string;
  body: string;
}

interface Input {
  code: string;
  userName: string;
  language: Language;
}

@Injectable()
export class VerificationCodeTemplate {
  generate(input: Input): Output {
    switch (input.language) {
      case 'pt-BR': {
        return {
          head: `Seu código de verificação é ${input.code}`,
          body: `Olá, ${input.userName}!\nEstamos quase lá. Insira o código ${input.code} para confirmar seu e-mail e ativar sua conta com segurança. Ele expira em uma hora.`,
        };
      }
      default:
        throw new UnimplementedLanguageError(input.language);
    }
  }
}
