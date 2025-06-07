import { firebaseScryptHash, FirebaseHashConfig } from '../src/lib/firebaseScrypt';

test('firebaseScryptHash matches expected output', async () => {
  const config: FirebaseHashConfig = {
    base64_signer_key: '6P1/RoypdKDx+Pldf7cH/ehGOPNuMW6o/xryOFp6u6l++KmbPDWmPZtlh2MPH1M/Qnt98+udXjku7SQ34Qx1dw==',
    base64_salt_separator: 'Bw==',
    rounds: 8,
    mem_cost: 14,
  };

  const hash = await firebaseScryptHash('password', 'salt', config);
  expect(hash).toBe('fxfkMVae9kJS9pEsZ9FwJtFSOXiDyV7OaoPakPYZDlmLMFeh6V44yA1boY+PXbOFkPcKaHfX41UaElbxP6lmyA==');
});
