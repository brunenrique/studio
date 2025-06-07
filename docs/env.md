# Variáveis de Ambiente

Para gerar uma chave segura para `CRYPTO_SECRET_KEY` execute:

```bash
openssl rand -base64 32
```

Configure essa chave em `.env.local` durante o desenvolvimento e também registre-a como segredo nas funções do Firebase:

```bash
firebase functions:config:set secrets.crypto_key="<SUA_CHAVE>"

# Segredos adicionais

Defina outros valores sensíveis, como chaves da SendGrid ou credenciais do Twilio,
utilizando o mesmo comando. Por exemplo:

```bash
firebase functions:config:set \
  secrets.sendgrid_api_key="<SENDGRID_KEY>" \
  secrets.sendgrid_from_email="no-reply@example.com" \
  secrets.twilio_sid="<TWILIO_SID>" \
  secrets.twilio_auth_token="<TWILIO_TOKEN>"
```

Para usar estes valores localmente no emulador exporte a configuração para
`.runtimeconfig.json`:

```bash
firebase functions:config:get > .runtimeconfig.json
```
