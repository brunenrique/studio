# Variáveis de Ambiente

Para gerar uma chave segura para `CRYPTO_SECRET_KEY` execute:

```bash
openssl rand -base64 32
```

Configure essa chave em `.env.local` durante o desenvolvimento e também nas funções do Firebase:

```bash
firebase functions:config:set secrets.crypto_key="<SUA_CHAVE>"
```
