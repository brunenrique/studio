import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SECRET_KEY) {
    return res.status(500).json({ error: 'Server encryption key not configured.' });
  }

  const { action, data } = req.body;

  if (req.method !== 'POST' || !action || !data) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    if (action === 'encrypt') {
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return res.status(200).json({ result: encryptedData });
    }

    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return res.status(200).json({ result: decryptedData });
    }

    return res.status(400).json({ error: 'Unknown action.' });

  } catch (error) {
    return res.status(500).json({ error: 'Encryption operation failed.' });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SECRET_KEY) {
    return res.status(500).json({ error: 'Server encryption key not configured.' });
  }

  const { action, data } = req.body;

  if (req.method !== 'POST' || !action || !data) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    if (action === 'encrypt') {
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return res.status(200).json({ result: encryptedData });
    }

    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return res.status(200).json({ result: decryptedData });
    }

    return res.status(400).json({ error: 'Unknown action.' });

  } catch (error) {
    return res.status(500).json({ error: 'Encryption operation failed.' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SECRET_KEY) {
    return res.status(500).json({ error: 'Server encryption key not configured.' });
  }

  const { action, data } = req.body;

  if (req.method !== 'POST' || !action || !data) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    if (action === 'encrypt') {
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return res.status(200).json({ result: encryptedData });
    }

    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return res.status(200).json({ result: decryptedData });
    }

    return res.status(400).json({ error: 'Unknown action.' });

  } catch (error) {
    return res.status(500).json({ error: 'Encryption operation failed.' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SECRET_KEY) {
    return res.status(500).json({ error: 'Server encryption key not configured.' });
  }

  const { action, data } = req.body;

  if (req.method !== 'POST' || !action || !data) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    if (action === 'encrypt') {
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return res.status(200).json({ result: encryptedData });
    }

    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return res.status(200).json({ result: decryptedData });
    }

    return res.status(400).json({ error: 'Unknown action.' });

  } catch (error) {
    return res.status(500).json({ error: 'Encryption operation failed.' });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SECRET_KEY) {
    return res.status(500).json({ error: 'Server encryption key not configured.' });
  }

  const { action, data } = req.body;

  if (req.method !== 'POST' || !action || !data) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    if (action === 'encrypt') {
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return res.status(200).json({ result: encryptedData });
    }

    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return res.status(200).json({ result: decryptedData });
    }

    return res.status(400).json({ error: 'Unknown action.' });

  } catch (error) {
    return res.status(500).json({ error: 'Encryption operation failed.' });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
 if (!SECRET_KEY) {
 return res.status(500).json({ error: 'Server encryption key not configured.' });
 }

 const { action, data } = req.body;

 if (req.method !== 'POST' || !action || !data) {
 return res.status(400).json({ error: 'Invalid request.' });
 }

 try {
 if (action === 'encrypt') {
 const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
 return res.status(200).json({ result: encryptedData });
 }

 if (action === 'decrypt') {
 const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
 const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
 return res.status(200).json({ result: decryptedData });
 }

 return res.status(400).json({ error: 'Unknown action.' });

 } catch (error) {
 return res.status(500).json({ error: 'Encryption operation failed.' });
 }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SECRET_KEY) {
    return res.status(500).json({ error: 'Server encryption key not configured.' });
  }

  const { action, data } = req.body;

  if (req.method !== 'POST' || !action || !data) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    if (action === 'encrypt') {
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return res.status(200).json({ result: encryptedData });
    }

    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return res.status(200).json({ result: decryptedData });
    }

    return res.status(400).json({ error: 'Unknown action.' });

  } catch (error) {
    return res.status(500).json({ error: 'Encryption operation failed.' });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SECRET_KEY) {
    return res.status(500).json({ error: 'Server encryption key not configured.' });
  }

  const { action, data } = req.body;

  if (req.method !== 'POST' || !action || !data) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    if (action === 'encrypt') {
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return res.status(200).json({ result: encryptedData });
    }

    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return res.status(200).json({ result: decryptedData });
    }

    return res.status(400).json({ error: 'Unknown action.' });

  } catch (error) {
    return res.status(500).json({ error: 'Encryption operation failed.' });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SECRET_KEY) {
    return res.status(500).json({ error: 'Server encryption key not configured.' });
  }

  const { action, data } = req.body;

  if (req.method !== 'POST' || !action || !data) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    if (action === 'encrypt') {
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return res.status(200).json({ result: encryptedData });
    }

    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return res.status(200).json({ result: decryptedData });
    }

    return res.status(400).json({ error: 'Unknown action.' });

  } catch (error) {
    return res.status(500).json({ error: 'Encryption operation failed.' });
  }
}
<CODE_BLOCK>
import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

// Reads the secret key from the server's "secret vault".
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SECRET_KEY) {
    return res.status(500).json({ error: 'Server encryption key not configured.' });
  }

  const { action, data } = req.body;

  if (req.method !== 'POST' || !action || !data) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  try {
    if (action === 'encrypt') {
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return res.status(200).json({ result: encryptedData });
    }

    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return res.status(200).json({ result: decryptedData });
    }

    return res.status(400).json({ error: 'Unknown action.' });

  } catch (error) {
    return res.status(500).json({ error: 'Encryption operation failed.' });
  }
}
</CODE_BLOCK>